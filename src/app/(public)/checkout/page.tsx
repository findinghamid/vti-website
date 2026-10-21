"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Lock,
  CreditCard,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  Sparkles,
  ShoppingBag,
  Check,
  X,
  Eye,
  EyeOff,
  UserCheck,
  UserPlus,
  Loader2,
  BookOpen,
} from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { VtiButton, VtiBadge } from "@/components/ui/vti";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, itemCount, breakdown, appliedCouponCode, isLoading: isCartLoading } = useCart();

  // Authentication & session state
  const [currentUser, setCurrentUser] = useState<{ id: string; name: string; email: string } | null>(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  // Billing form state
  const [billingName, setBillingName] = useState("");
  const [billingEmail, setBillingEmail] = useState("");
  const [billingPhone, setBillingPhone] = useState("");
  const [billingCountry, setBillingCountry] = useState("United States");
  const [billingAddress, setBillingAddress] = useState("");
  const [orderNotes, setOrderNotes] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [paymentProvider, setPaymentProvider] = useState<"MOCK" | "STRIPE" | "PAYPAL">("MOCK");

  // Inline Account Detection & Password State
  const [emailStatus, setEmailStatus] = useState<"idle" | "checking" | "registered" | "new">("idle");
  const [registeredName, setRegisteredName] = useState<string | null>(null);
  const [accountPassword, setAccountPassword] = useState("");
  const [showAccountPassword, setShowAccountPassword] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Card details (for mock / stripe card view)
  const [cardNumber, setCardNumber] = useState("4242 4242 4242 4242");
  const [expMonth, setExpMonth] = useState("12");
  const [expYear, setExpYear] = useState("28");
  const [cvc, setCvc] = useState("123");

  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Load existing logged in session on mount
  useEffect(() => {
    fetch("/api/v1/auth/me")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.data?.user) {
          setCurrentUser(data.data.user);
          setBillingName(data.data.user.name || "");
          setBillingEmail(data.data.user.email || "");
        }
      })
      .catch(() => {})
      .finally(() => setIsCheckingAuth(false));
  }, []);

  // Check email existence dynamically
  const checkEmail = useCallback(async (email: string) => {
    const trimmed = email.trim();
    if (!trimmed || !trimmed.includes("@") || !trimmed.includes(".")) {
      setEmailStatus("idle");
      return;
    }

    setEmailStatus("checking");
    setAuthError(null);

    try {
      const res = await fetch(`/api/v1/auth/check-email?email=${encodeURIComponent(trimmed)}`);
      const data = await res.json();
      if (data?.data?.exists) {
        setEmailStatus("registered");
        setRegisteredName(data.data.name || null);
      } else {
        setEmailStatus("new");
        setRegisteredName(null);
      }
    } catch {
      setEmailStatus("idle");
    }
  }, []);

  // Debounced email check
  useEffect(() => {
    if (currentUser) return;
    const timer = setTimeout(() => {
      if (billingEmail && billingEmail.includes("@")) {
        checkEmail(billingEmail);
      }
    }, 600);
    return () => clearTimeout(timer);
  }, [billingEmail, currentUser, checkEmail]);

  // Dynamic password criteria validation for new accounts
  const passwordRules = useMemo(() => {
    return [
      { id: "length", label: "At least 8 characters", met: accountPassword.length >= 8 },
      { id: "upper", label: "One uppercase letter (A-Z)", met: /[A-Z]/.test(accountPassword) },
      { id: "lower", label: "One lowercase letter (a-z)", met: /[a-z]/.test(accountPassword) },
      { id: "number", label: "One number (0-9)", met: /[0-9]/.test(accountPassword) },
    ];
  }, [accountPassword]);

  const isPasswordValid = passwordRules.every((r) => r.met);

  const fillQuickCard = (type: "valid" | "decline") => {
    if (type === "valid") {
      setCardNumber("4242 4242 4242 4242");
      setExpMonth("12");
      setExpYear("28");
      setCvc("123");
    } else {
      setCardNumber("4000 0000 0000 0002");
      setExpMonth("08");
      setExpYear("27");
      setCvc("999");
    }
    setErrorMessage(null);
  };

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;

    if (!agreeTerms) {
      setErrorMessage("Please agree to the terms of service and website policy to proceed.");
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);
    setAuthError(null);

    try {
      // 1. Authenticate user if not currently logged in
      let activeUser = currentUser;

      if (!activeUser) {
        if (!billingEmail || !billingEmail.includes("@")) {
          throw new Error("Please enter a valid email address.");
        }

        // If email is already registered, authenticate via login
        if (emailStatus === "registered") {
          if (!accountPassword) {
            setAuthError("Please enter your account password to sign in and complete checkout.");
            throw new Error("Account password is required for your registered email.");
          }

          const loginRes = await fetch("/api/v1/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: billingEmail.trim(), password: accountPassword }),
          });

          const loginData = await loginRes.json();
          if (!loginRes.ok || !loginData.success) {
            const msg = loginData.error?.message || "Incorrect password for this account. Please try again.";
            setAuthError(msg);
            throw new Error(msg);
          }

          activeUser = loginData.data.user;
          setCurrentUser(loginData.data.user);
        } else {
          // New student user: validate name and password rules, then create account
          if (!billingName || billingName.trim().length < 2) {
            throw new Error("Please enter your full name.");
          }

          if (!isPasswordValid) {
            const unmet = passwordRules.filter((r) => !r.met).map((r) => r.label);
            setAuthError(`Password requirements not met: ${unmet.join(", ")}`);
            throw new Error("Please satisfy all password criteria to create your account.");
          }

          const signupRes = await fetch("/api/v1/auth/signup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              name: billingName.trim(),
              email: billingEmail.trim(),
              password: accountPassword,
            }),
          });

          const signupData = await signupRes.json();
          if (!signupRes.ok || !signupData.success) {
            const msg = signupData.error?.message || "Failed to create your student account.";
            setAuthError(msg);
            throw new Error(msg);
          }

          activeUser = signupData.data.user;
          setCurrentUser(signupData.data.user);
        }
      }

      // 2. Initialize checkout intent and order
      const intentRes = await fetch("/api/v1/checkout/intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          paymentProvider,
          couponCode: appliedCouponCode,
          billingName: billingName.trim(),
          billingEmail: billingEmail.trim(),
        }),
      });

      const intentData = await intentRes.json();
      if (!intentRes.ok || !intentData.success) {
        throw new Error(intentData.error?.message || "Failed to initialize order.");
      }

      const { order, providerRefId } = intentData.data;

      // 3. Confirm payment execution
      const confirmRes = await fetch("/api/v1/checkout/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: order.id,
          providerRefId,
          paymentProvider,
          paymentDetails: {
            cardNumber,
            cardHolder: billingName || "Student Cardholder",
            expMonth,
            expYear,
            cvc,
          },
        }),
      });

      const confirmData = await confirmRes.json();
      if (!confirmRes.ok || !confirmData.success) {
        throw new Error(confirmData.error?.message || "Payment authorization failed.");
      }

      // 4. Success -> Route to confirmation screen
      router.push(`/checkout/success?orderId=${confirmData.data.order.id}`);
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : "Payment processing error.");
      setIsProcessing(false);
    }
  };

  if (!isCartLoading && items.length === 0) {
    return (
      <div className="min-h-screen bg-white py-20">
        <div className="max-w-md mx-auto px-4 text-center space-y-4">
          <div className="w-20 h-20 rounded-3xl bg-[#FF5B35]/10 text-[#FF5B35] mx-auto flex items-center justify-center">
            <ShoppingBag className="w-10 h-10" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-heading text-[#161821]">Your Cart is Empty</h1>
          <p className="text-sm text-[#57595F]">
            Please add at least one course track to your cart before proceeding to checkout.
          </p>
          <div className="pt-2">
            <VtiButton href="/courses" variant="primary" size="lg" showArrow>
              Explore Course Catalog
            </VtiButton>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFFFFF]">
      {/* 1. VTI Breadcrumb Area () */}
      <section className="relative py-14 bg-[#161821] text-white overflow-hidden">
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <Image
            src="/assets/img/breadcrumb/breadcrumb-bg.jpg"
            alt="Breadcrumb Background"
            fill
            sizes="100vw"
            className="object-cover"
            priority
          />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col items-center text-center">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 mb-3">
              <Link href="/" className="hover:text-white transition">Home</Link>
              <span>/</span>
              <Link href="/cart" className="hover:text-white transition">Cart</Link>
              <span>/</span>
              <span className="text-[#FF5B35]">Checkout</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black font-heading tracking-tight text-white">
              Complete Your Enrollment
            </h1>
            <div className="flex items-center gap-2 text-xs text-slate-300 mt-2 bg-white/10 px-3.5 py-1 rounded-full border border-white/15">
              <Lock className="w-3.5 h-3.5 text-[#09BD3C]" />
              <span>256-Bit SSL Encrypted Checkout</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Main Checkout Form Area (VTI ) */}
      <section className="py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Global Error Banner */}
          {errorMessage && (
            <div className="mb-8 p-4 rounded-2xl bg-[#FF4D4F]/10 border border-[#FF4D4F]/30 text-[#FF4D4F] flex items-center gap-3 text-sm font-bold animate-in fade-in">
              <AlertCircle className="w-5 h-5 shrink-0 text-[#FF4D4F]" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleCheckoutSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            {/* Left Column: Billing & Account Authentication (7 cols) () */}
            <div className="lg:col-span-7 space-y-6">
              <div className="rounded-3xl border border-[#EAEBED] bg-white p-6 sm:p-10 shadow-xs space-y-6">
                <div className="border-b border-[#EAEBED] pb-4">
                  <h2 className="text-xl sm:text-2xl font-black font-heading text-[#161821]">
                    Billing Details & Account Access
                  </h2>
                  <p className="text-xs text-[#57595F] mt-1">
                    Your official course certificate and sandbox credentials will be linked to this account.
                  </p>
                </div>

                {/* Logged in state display */}
                {currentUser ? (
                  <div className="p-4 rounded-2xl bg-[#09BD3C]/10 border border-[#09BD3C]/20 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-[#09BD3C] text-white font-extrabold flex items-center justify-center text-sm shadow-xs">
                        {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : "U"}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-sm text-[#161821]">{currentUser.name}</span>
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-[#09BD3C]/20 text-[#09BD3C] px-2 py-0.5 rounded-full">
                            <CheckCircle2 className="w-3 h-3" /> Signed In
                          </span>
                        </div>
                        <p className="text-xs text-[#57595F]">{currentUser.email}</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={async () => {
                        await fetch("/api/v1/auth/logout", { method: "POST" });
                        setCurrentUser(null);
                        setBillingName("");
                        setBillingEmail("");
                        setEmailStatus("idle");
                      }}
                      className="text-xs font-bold text-[#FF5B35] hover:underline cursor-pointer"
                    >
                      Switch Account
                    </button>
                  </div>
                ) : (
                  /* Unauthenticated Guest Inputs with Inline Account Detection */
                  <div className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-[#57595F] mb-1.5">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Alex Morgan"
                          value={billingName}
                          onChange={(e) => setBillingName(e.target.value)}
                          className="w-full h-12 px-4 rounded-2xl bg-[#F8F8FA] border border-[#EAEBED] text-[#161821] text-sm focus:outline-none focus:border-[#FF5B35] transition duration-200"
                        />
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <label className="text-xs font-bold uppercase tracking-wider text-[#57595F]">
                            Email Address *
                          </label>
                          {emailStatus === "checking" && (
                            <span className="text-[11px] text-[#FF5B35] font-semibold flex items-center gap-1">
                              <Loader2 className="w-3 h-3 animate-spin" /> Verifying...
                            </span>
                          )}
                        </div>
                        <input
                          type="email"
                          required
                          placeholder="alex@company.com"
                          value={billingEmail}
                          onChange={(e) => setBillingEmail(e.target.value)}
                          onBlur={() => checkEmail(billingEmail)}
                          className="w-full h-12 px-4 rounded-2xl bg-[#F8F8FA] border border-[#EAEBED] text-[#161821] text-sm focus:outline-none focus:border-[#FF5B35] transition duration-200"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-[#57595F] mb-1.5">
                          Phone Number (Optional)
                        </label>
                        <input
                          type="tel"
                          placeholder="+1 (555) 019-2834"
                          value={billingPhone}
                          onChange={(e) => setBillingPhone(e.target.value)}
                          className="w-full h-12 px-4 rounded-2xl bg-[#F8F8FA] border border-[#EAEBED] text-[#161821] text-sm focus:outline-none focus:border-[#FF5B35] transition duration-200"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-[#57595F] mb-1.5">
                          Country / Region
                        </label>
                        <select
                          value={billingCountry}
                          onChange={(e) => setBillingCountry(e.target.value)}
                          className="w-full h-12 px-4 rounded-2xl bg-[#F8F8FA] border border-[#EAEBED] text-[#161821] text-sm focus:outline-none focus:border-[#FF5B35] transition duration-200 cursor-pointer"
                        >
                          <option value="United States">United States</option>
                          <option value="United Kingdom">United Kingdom</option>
                          <option value="Canada">Canada</option>
                          <option value="Germany">Germany</option>
                          <option value="Australia">Australia</option>
                          <option value="Pakistan">Pakistan</option>
                          <option value="India">India</option>
                          <option value="United Arab Emirates">United Arab Emirates</option>
                          <option value="Saudi Arabia">Saudi Arabia</option>
                          <option value="Singapore">Singapore</option>
                        </select>
                      </div>
                    </div>

                    {/* Case 1: Existing Account Detected -> Prompt for Password */}
                    {emailStatus === "registered" && (
                      <div className="p-5 rounded-2xl bg-[#FF5B35]/10 border border-[#FF5B35]/25 space-y-3.5 animate-in fade-in zoom-in-95">
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-xl bg-[#FF5B35] text-white flex items-center justify-center shrink-0 shadow-xs">
                            <UserCheck className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="font-extrabold text-sm text-[#161821]">
                              Welcome back{registeredName ? `, ${registeredName}` : ""}! This email is already registered.
                            </p>
                            <p className="text-xs text-[#57595F] mt-0.5">
                              Please enter your password below to sign in and link this course to your existing student learning dashboard.
                            </p>
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wider text-[#161821] mb-1.5">
                            Account Password *
                          </label>
                          <div className="relative">
                            <input
                              type={showAccountPassword ? "text" : "password"}
                              required
                              placeholder="Enter your account password"
                              value={accountPassword}
                              onChange={(e) => setAccountPassword(e.target.value)}
                              className="w-full h-12 pl-4 pr-11 rounded-2xl bg-white border border-[#EAEBED] text-[#161821] text-sm focus:outline-none focus:border-[#FF5B35]"
                            />
                            <button
                              type="button"
                              onClick={() => setShowAccountPassword(!showAccountPassword)}
                              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer p-1"
                            >
                              {showAccountPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Case 2: New User Detected -> Auto-create account & require password */}
                    {emailStatus === "new" && (
                      <div className="p-5 rounded-2xl bg-[#09BD3C]/10 border border-[#09BD3C]/25 space-y-3.5 animate-in fade-in zoom-in-95">
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-xl bg-[#09BD3C] text-white flex items-center justify-center shrink-0 shadow-xs">
                            <UserPlus className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="font-extrabold text-sm text-[#161821]">
                              Welcome to VTI! We will auto-create your student account.
                            </p>
                            <p className="text-xs text-[#57595F] mt-0.5">
                              Create your password below. Your student account will be automatically generated upon order completion so you can access your course immediately.
                            </p>
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wider text-[#161821] mb-1.5">
                            Choose a Password for Your Account *
                          </label>
                          <div className="relative">
                            <input
                              type={showAccountPassword ? "text" : "password"}
                              required
                              placeholder="Create a strong password"
                              value={accountPassword}
                              onChange={(e) => setAccountPassword(e.target.value)}
                              className="w-full h-12 pl-4 pr-11 rounded-2xl bg-white border border-[#EAEBED] text-[#161821] text-sm focus:outline-none focus:border-[#FF5B35]"
                            />
                            <button
                              type="button"
                              onClick={() => setShowAccountPassword(!showAccountPassword)}
                              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer p-1"
                            >
                              {showAccountPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                          </div>

                          {/* Password Criteria Pills */}
                          <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                            {passwordRules.map((rule) => (
                              <div
                                key={rule.id}
                                className={`flex items-center gap-1.5 text-[11px] font-semibold ${
                                  rule.met ? "text-[#09BD3C]" : "text-slate-400"
                                }`}
                              >
                                {rule.met ? (
                                  <Check className="w-3.5 h-3.5 shrink-0" />
                                ) : (
                                  <X className="w-3.5 h-3.5 shrink-0 text-slate-300" />
                                )}
                                <span>{rule.label}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {authError && (
                      <div className="p-3.5 rounded-2xl bg-[#FF4D4F]/10 border border-[#FF4D4F]/30 text-[#FF4D4F] text-xs font-bold flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>{authError}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Payment Methods Section (VTI ) */}
              <div className="rounded-3xl border border-[#EAEBED] bg-white p-6 sm:p-10 shadow-xs space-y-5">
                <div className="border-b border-[#EAEBED] pb-4">
                  <h3 className="text-xl sm:text-2xl font-black font-heading text-[#161821]">
                    Payment Method
                  </h3>
                  <p className="text-xs text-[#57595F] mt-1">
                    Select your preferred transaction gateway. All transactions are securely processed.
                  </p>
                </div>

                <div className="space-y-3">
                  {/* Option 1: Mock Instant Sandbox Checkout (Default) */}
                  <label
                    className={`flex items-start gap-4 p-4 rounded-2xl border-2 transition duration-200 cursor-pointer ${
                      paymentProvider === "MOCK"
                        ? "border-[#FF5B35] bg-[#FF5B35]/5"
                        : "border-[#EAEBED] hover:border-slate-300 bg-white"
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentProvider"
                      checked={paymentProvider === "MOCK"}
                      onChange={() => setPaymentProvider("MOCK")}
                      className="mt-1 text-[#FF5B35] focus:ring-[#FF5B35]"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-extrabold text-sm text-[#161821]">
                          Mock Instant Checkout (Instant Sandbox)
                        </span>
                        <span className="text-[10px] font-bold text-[#09BD3C] bg-[#09BD3C]/10 px-2 py-0.5 rounded-md">
                          Recommended
                        </span>
                      </div>
                      <p className="text-xs text-[#57595F] mt-0.5 leading-relaxed">
                        Authorize instantly with simulated test credentials. Enrolls you directly into your sandbox.
                      </p>

                      {paymentProvider === "MOCK" && (
                        <div className="mt-3 pt-3 border-t border-[#EAEBED] flex items-center gap-2">
                          <span className="text-xs text-[#57595F]">Quick Fill Test Card:</span>
                          <button
                            type="button"
                            onClick={() => fillQuickCard("valid")}
                            className="px-2.5 py-1 rounded-lg bg-[#09BD3C]/10 hover:bg-[#09BD3C]/20 text-[#09BD3C] text-xs font-bold cursor-pointer"
                          >
                            Success Card
                          </button>
                          <button
                            type="button"
                            onClick={() => fillQuickCard("decline")}
                            className="px-2.5 py-1 rounded-lg bg-[#FF4D4F]/10 hover:bg-[#FF4D4F]/20 text-[#FF4D4F] text-xs font-bold cursor-pointer"
                          >
                            Decline Card
                          </button>
                        </div>
                      )}
                    </div>
                  </label>

                  {/* Option 2: Stripe Credit Card */}
                  <label
                    className={`flex items-start gap-4 p-4 rounded-2xl border-2 transition duration-200 cursor-pointer ${
                      paymentProvider === "STRIPE"
                        ? "border-[#FF5B35] bg-[#FF5B35]/5"
                        : "border-[#EAEBED] hover:border-slate-300 bg-white"
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentProvider"
                      checked={paymentProvider === "STRIPE"}
                      onChange={() => setPaymentProvider("STRIPE")}
                      className="mt-1 text-[#FF5B35] focus:ring-[#FF5B35]"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-extrabold text-sm text-[#161821]">
                          Credit or Debit Card (Stripe Gateway)
                        </span>
                        <div className="flex items-center gap-1.5 text-xs text-slate-400">
                          <CreditCard className="w-4 h-4 text-[#FF5B35]" />
                        </div>
                      </div>
                      <p className="text-xs text-[#57595F] mt-0.5">
                        Direct 256-bit encrypted credit card transaction.
                      </p>
                    </div>
                  </label>

                  {/* Option 3: PayPal */}
                  <label
                    className={`flex items-start gap-4 p-4 rounded-2xl border-2 transition duration-200 cursor-pointer ${
                      paymentProvider === "PAYPAL"
                        ? "border-[#FF5B35] bg-[#FF5B35]/5"
                        : "border-[#EAEBED] hover:border-slate-300 bg-white"
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentProvider"
                      checked={paymentProvider === "PAYPAL"}
                      onChange={() => setPaymentProvider("PAYPAL")}
                      className="mt-1 text-[#FF5B35] focus:ring-[#FF5B35]"
                    />
                    <div className="flex-1">
                      <span className="font-extrabold text-sm text-[#161821]">
                        PayPal Express Checkout
                      </span>
                      <p className="text-xs text-[#57595F] mt-0.5">
                        Pay with your PayPal balance or linked accounts.
                      </p>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* Right Column: "Your Order" Summary (5 cols) (VTI ) */}
            <div className="lg:col-span-5 space-y-6">
              <div className="rounded-3xl border border-[#EAEBED] bg-[#FAF9F6] p-6 sm:p-8 shadow-sm space-y-6">
                <div className="border-b border-[#EAEBED] pb-4">
                  <h3 className="text-xl font-black font-heading text-[#161821]">
                    Your Order Summary
                  </h3>
                  <p className="text-xs text-[#57595F] mt-1">
                    {itemCount} {itemCount === 1 ? "track" : "tracks"} ready for enrollment
                  </p>
                </div>

                {/* Items List (VTI ) */}
                <div className="space-y-3.5">
                  <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-[#57595F] pb-2 border-b border-[#EAEBED]">
                    <span>Product Course</span>
                    <span>Subtotal</span>
                  </div>

                  <div className="divide-y divide-[#EAEBED]/70 max-h-60 overflow-y-auto space-y-2 pr-1">
                    {items.map((item) => (
                      <div key={item.id} className="pt-2 flex items-start justify-between gap-3 text-xs">
                        <div className="min-w-0 flex-1">
                          <p className="font-bold text-[#161821] line-clamp-1 leading-snug">
                            {item.title}
                          </p>
                          {item.instructors && item.instructors.length > 0 && (
                            <p className="text-[11px] text-[#57595F] truncate mt-0.5">
                              Lead: {item.instructors[0].name}
                            </p>
                          )}
                        </div>
                        <span className="font-extrabold text-[#161821] shrink-0">
                          {item.formattedPrice}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Price Breakdown Calculation */}
                {breakdown && (
                  <div className="pt-4 border-t border-[#EAEBED] space-y-2.5 text-xs font-semibold text-[#57595F]">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span className="text-[#161821] font-bold">{breakdown.formattedSubtotal}</span>
                    </div>

                    {breakdown.promotionalDiscountMinor > 0 && (
                      <div className="flex justify-between text-[#09BD3C]">
                        <span>Catalog Savings</span>
                        <span>-{breakdown.formattedPromotionalDiscount}</span>
                      </div>
                    )}

                    {breakdown.couponDiscountMinor > 0 && (
                      <div className="flex justify-between text-[#09BD3C]">
                        <span>Coupon Savings ({appliedCouponCode})</span>
                        <span>-{breakdown.formattedCouponDiscount}</span>
                      </div>
                    )}

                    <div className="pt-3 border-t border-[#EAEBED] flex justify-between items-baseline">
                      <span className="text-sm font-black text-[#161821]">Total Amount:</span>
                      <span className="text-2xl font-black text-[#FF5B35] font-heading">
                        {breakdown.formattedTotal}
                      </span>
                    </div>
                  </div>
                )}

                {/* Terms Agreement Checkbox (VTI ) */}
                <div className="pt-2 border-t border-[#EAEBED]">
                  <label className="flex items-start gap-2.5 cursor-pointer text-xs text-[#57595F]">
                    <input
                      type="checkbox"
                      checked={agreeTerms}
                      onChange={(e) => setAgreeTerms(e.target.checked)}
                      className="mt-0.5 rounded text-[#FF5B35] focus:ring-[#FF5B35]"
                    />
                    <span>
                      I have read and agree to the{" "}
                      <Link href="/terms" className="text-[#FF5B35] underline hover:text-[#E04824]">
                        Terms of Service
                      </Link>{" "}
                      and{" "}
                      <Link href="/privacy" className="text-[#FF5B35] underline hover:text-[#E04824]">
                        Privacy Policy
                      </Link>.
                    </span>
                  </label>
                </div>

                {/* Submit Action Button */}
                <div>
                  <button
                    type="submit"
                    disabled={isProcessing}
                    className="w-full h-14 rounded-2xl bg-[#FF5B35] hover:bg-[#E04824] text-white font-black text-sm tracking-tight transition duration-200 flex items-center justify-center gap-2 shadow-lg shadow-orange-600/25 disabled:opacity-70 cursor-pointer"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Authorizing & Enrolling...</span>
                      </>
                    ) : (
                      <>
                        <span>Place Order & Start Learning</span>
                        <Lock className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>

                {/* Trust guarantee badge list */}
                <div className="pt-4 border-t border-[#EAEBED] space-y-2 text-xs text-[#57595F]">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-[#09BD3C] shrink-0" />
                    <span>30-Day Money-Back Guarantee</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Lock className="w-4 h-4 text-[#FF5B35] shrink-0" />
                    <span>256-Bit SSL Encrypted Authorization</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-[#FFC221] shrink-0" />
                    <span>Immediate Sandbox Access on Success</span>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}
