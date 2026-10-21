import test, { describe } from "node:test";
import assert from "node:assert";
import { CertificateService } from "../src/server/services/certificate.service";

describe("Milestone 12: Certificate Generation & Public Verification", () => {
  const testUserId = `usr_cert_test_${Date.now()}`;
  const courseId = "course-demo-fallback";
  let issuedCertNo: string;

  test("should generate valid certificate serial number format", () => {
    const certNo = CertificateService.generateCertificateNumber();
    const currentYear = new Date().getFullYear();

    assert.ok(certNo.startsWith(`VTI-CERT-${currentYear}-`));
    assert.strictEqual(certNo.length, 20); // VTI-CERT-YYYY-XXXXXX = 9 + 4 + 1 + 6 = 20
  });

  test("should issue certificate and snapshot student and course data", async () => {
    const cert = await CertificateService.issueCertificate(testUserId, courseId);

    assert.ok(cert);
    assert.ok(cert.certificateNo);
    assert.strictEqual(cert.userId, testUserId);
    assert.strictEqual(cert.courseId, courseId);
    assert.strictEqual(cert.isRevoked, false);

    // Verify snapshots
    assert.ok(cert.studentSnapshot.name);
    assert.ok(cert.courseSnapshot.title);
    assert.ok(cert.courseSnapshot.instructorName);
    assert.ok(cert.courseSnapshot.formattedDuration);
    assert.ok(cert.verificationUrl.includes(cert.certificateNo));
    assert.ok(cert.linkedInShareUrl.includes("linkedin.com"));

    issuedCertNo = cert.certificateNo;
  });

  test("should enforce idempotent certificate issuance without duplicating serial number", async () => {
    assert.ok(issuedCertNo);
    const secondCall = await CertificateService.issueCertificate(testUserId, courseId);

    assert.strictEqual(
      secondCall.certificateNo,
      issuedCertNo,
      "Second issuance call must return the existing certificate"
    );
  });

  test("should publicly verify valid certificate by serial number", async () => {
    assert.ok(issuedCertNo);
    const result = await CertificateService.getCertificateByNumber(issuedCertNo);

    assert.strictEqual(result.status, "VALID");
    assert.ok(result.certificate);
    assert.strictEqual(result.certificate.certificateNo, issuedCertNo);
    assert.strictEqual(result.certificate.isRevoked, false);
  });

  test("should return NOT_FOUND for non-existent certificate number", async () => {
    const result = await CertificateService.getCertificateByNumber("VTI-CERT-0000-INVALID");

    assert.strictEqual(result.status, "NOT_FOUND");
    assert.strictEqual(result.certificate, undefined);
  });

  test("should mark status as REVOKED when certificate is revoked", async () => {
    assert.ok(issuedCertNo);
    const revoked = await CertificateService.revokeCertificate(issuedCertNo);
    assert.strictEqual(revoked, true);

    const lookup = await CertificateService.getCertificateByNumber(issuedCertNo);
    assert.strictEqual(lookup.status, "REVOKED");
    assert.ok(lookup.certificate);
    assert.strictEqual(lookup.certificate.isRevoked, true);
  });

  test("should retrieve all user certificates", async () => {
    const userCerts = await CertificateService.getUserCertificates(testUserId);

    assert.ok(userCerts.length >= 1);
    assert.strictEqual(userCerts[0].userId, testUserId);
  });

  test("should build a valid LinkedIn add certificate URL with prefilled parameters", () => {
    const shareUrl = CertificateService.buildLinkedInShareUrl(
      "VTI-CERT-2026-TEST01",
      "Next.js 16 Enterprise Architecture",
      new Date("2026-05-15")
    );

    assert.ok(shareUrl.startsWith("https://www.linkedin.com/profile/add"));
    assert.ok(shareUrl.includes("CERTIFICATION_NAME"));
    assert.ok(shareUrl.includes("VTI-CERT-2026-TEST01"));
    assert.ok(shareUrl.includes("issueYear=2026"));
  });
});

describe("Milestone 12: Student Badges & Gamification", () => {
  const testUserId = `usr_badge_test_${Date.now()}`;

  test("should award a badge and increment student experience points", async () => {
    const badge = await CertificateService.awardBadge(testUserId, "PERFECT_SCORE");

    assert.ok(badge);
    assert.strictEqual(badge.userId, testUserId);
    assert.strictEqual(badge.badgeCode, "PERFECT_SCORE");
    assert.strictEqual(badge.points, 50);
    assert.ok(badge.title.includes("Assessment Ace"));
  });

  test("should avoid duplicate awards for the same badge", async () => {
    const first = await CertificateService.awardBadge(testUserId, "CODE_WIZARD");
    const second = await CertificateService.awardBadge(testUserId, "CODE_WIZARD");

    assert.ok(first);
    assert.ok(second);
    assert.strictEqual(first.id, second.id, "Duplicate badge award should return original badge");
  });

  test("should retrieve student gamification profile with total points and streak", async () => {
    const profile = await CertificateService.getUserBadges(testUserId);

    assert.ok(profile);
    assert.ok(profile.badges.length >= 2);
    assert.ok(profile.totalPoints >= 125); // 50 from PERFECT_SCORE + 75 from CODE_WIZARD
    assert.ok(profile.currentStreak >= 1);
  });
});
