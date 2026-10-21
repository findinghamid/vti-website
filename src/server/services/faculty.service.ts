export interface FacultyMember {
  id: string;
  slug: string;
  name: string;
  title: string;
  credentials: string;
  department: string;
  avatarUrl: string;
  email: string;
  phone?: string;
  bio: string;
  teachingPhilosophy: string;
  education: Array<{
    degree: string;
    institution: string;
    year: string;
  }>;
  expertise: string[];
  publications: string[];
  coursesTaught: Array<{
    title: string;
    slug: string;
    level: string;
    students: number;
    rating: number;
  }>;
  socialLinks: {
    twitter?: string;
    linkedin?: string;
    website?: string;
  };
}

export const FACULTY_MEMBERS: FacultyMember[] = [
  {
    id: "faculty-junaid-javed",
    slug: "dr-junaid-javed",
    name: "Dr. Junaid Javed, Ph.D.",
    title: "Founder & Academic Dean",
    credentials: "Ph.D., Th.M.",
    department: "Christian Foundation & Systematic Theology",
    avatarUrl: "/assets/img/teacher/teacher-1.png",
    email: "junaid.javed@vti-edu.org",
    bio: "Dr. Junaid Javed has dedicated his life to orthodox theological education, authoring curriculum for Urdu-speaking believers across Pakistan and globally. He specializes in trinitarian dogmatics, historic confessions, and practical biblical theology.",
    teachingPhilosophy: "Theology is the reverent contemplation of God leading to worship and holy living. Our mission is to make sound biblical education clear, practical, and accessible for believers across all stages of faith.",
    education: [
      { degree: "Doctor of Philosophy (Ph.D.) in Systematic Theology", institution: "Theological Seminary", year: "2015" },
      { degree: "Master of Theology (Th.M.)", institution: "Divinity School", year: "2009" },
      { degree: "Bachelor of Arts in Biblical Studies", institution: "Christian College", year: "2005" },
    ],
    expertise: ["Christian Foundational Beliefs", "Trinitarian Dogmatics", "Bibliology & Inerrancy", "Spiritual Disciplines", "Urdu Expository Preaching"],
    publications: [
      "The Unchanging Word: Biblical Truth in the Contemporary World",
      "Foundations of Faith: An Orthodox Urdu Doctrinal Primer",
    ],
    coursesTaught: [
      {
        title: "Christian Foundational Beliefs",
        slug: "christian-foundational-beliefs",
        level: "Beginner",
        students: 0,
        rating: 5.0,
      },
      {
        title: "Spiritual Life",
        slug: "spiritual-life",
        level: "Intermediate",
        students: 0,
        rating: 5.0,
      },
    ],
    socialLinks: {
      linkedin: "https://linkedin.com",
      website: "https://vti-edu.org",
    },
  },
  {
    id: "faculty-robin-sarfraz",
    slug: "robin-sarfraz",
    name: "Robin Sarfraz, M.Div.",
    title: "Executive Director & Lecturer in Old Testament & Ethics",
    credentials: "M.Div., B.Th.",
    department: "Bible Understanding & Christian Living",
    avatarUrl: "/assets/img/teacher/teacher-2.png",
    email: "robin.sarfraz@vti-edu.org",
    bio: "Robin Sarfraz brings years of pastoral leadership, church ministry coordination, and music theological direction. He oversees course development, pastoral care liaisons, and the Go Gospel worship initiatives.",
    teachingPhilosophy: "The Holy Scriptures are a lamp unto our feet. Walking through the journeys of the Old Testament and the moral demands of Christ reveals God's tender comfort: we are never alone.",
    education: [
      { degree: "Master of Divinity (M.Div.)", institution: "Theological Seminary", year: "2018" },
      { degree: "Bachelor of Theology (B.Th.)", institution: "Bible Institute", year: "2012" },
    ],
    expertise: ["Exodus & Redemptive Narrative", "Christian Ethics & Social Witness", "Pastoral Care & Loneliness", "Worship & Hymnody"],
    publications: [
      "Journey of Faith: Covenant Lessons from the Book of Exodus",
      "Living in Holiness: Biblical Ethics for the Everyday Believer",
    ],
    coursesTaught: [
      {
        title: "Exodus: Journey of Faith",
        slug: "exodus-journey-of-faith",
        level: "All Levels",
        students: 0,
        rating: 5.0,
      },
      {
        title: "You Are Not Alone",
        slug: "you-are-not-alone",
        level: "All Levels",
        students: 0,
        rating: 5.0,
      },
      {
        title: "Christian Ethics",
        slug: "christian-ethics",
        level: "Intermediate",
        students: 0,
        rating: 5.0,
      },
    ],
    socialLinks: {
      linkedin: "https://linkedin.com",
      website: "https://vti-edu.org",
    },
  },
  {
    id: "faculty-vance",
    slug: "prof-david-m-vance",
    name: "Prof. David M. Vance, Ph.D.",
    title: "Chair of Biblical Languages & Exegesis",
    credentials: "Ph.D., Th.M.",
    department: "Biblical Languages & Apologetics",
    avatarUrl: "/assets/img/teacher/teacher-3.png",
    email: "d.vance@vti-edu.org",
    bio: "Prof. David Vance specializes in grammatical-historical exegesis, biblical hermeneutics, and manuscript reliability. He equips students to defend the inerrancy and divine preservation of the Holy Scriptures.",
    teachingPhilosophy: "Reading the sacred text with exegetical rigor and reverence safeguards the Church against doctrinal error and ignites a lifelong hunger for God's infallible Word.",
    education: [
      { degree: "Doctor of Philosophy (Ph.D.) in Biblical Linguistics", institution: "University of Cambridge", year: "2011" },
      { degree: "Master of Theology (Th.M.) in Semitic Languages", institution: "Divinity School", year: "2005" },
    ],
    expertise: ["Grammatical-Historical Hermeneutics", "Biblical Exegesis", "Manuscript Preservation", "Christian Apologetics"],
    publications: [
      "Principles of Biblical Hermeneutics for the Global Church",
      "The Unchanged Word: Defending Scripture's Historical Reliability",
    ],
    coursesTaught: [
      {
        title: "Principles of Reading and Understanding the Bible",
        slug: "principles-reading-understanding-bible",
        level: "Beginner",
        students: 0,
        rating: 5.0,
      },
      {
        title: "Unchanged Words",
        slug: "unchanged-words",
        level: "Intermediate",
        students: 0,
        rating: 5.0,
      },
    ],
    socialLinks: {
      linkedin: "https://linkedin.com",
      website: "https://vti-edu.org",
    },
  },
];

export class FacultyService {
  static getAllFaculty(): FacultyMember[] {
    return FACULTY_MEMBERS;
  }

  static getFacultyBySlug(slug: string): FacultyMember | null {
    const cleaned = slug.toLowerCase().trim();
    return (
      FACULTY_MEMBERS.find(
        (f) =>
          f.slug === cleaned ||
          f.id === cleaned ||
          cleaned.includes(f.id.replace("faculty-", "")) ||
          f.name.toLowerCase().includes(cleaned.replace("dr-", "").replace("prof-", "")) ||
          cleaned.includes(f.slug.replace("dr-", "").replace("prof-", ""))
      ) || null
    );
  }

  static getFacultyForCourse(courseSlug: string): FacultyMember[] {
    return FACULTY_MEMBERS.filter((f) =>
      f.coursesTaught.some(
        (c) => c.slug === courseSlug || courseSlug.includes(c.slug) || c.slug.includes(courseSlug)
      )
    );
  }

  static resolveFacultySlug(instructor: { id?: string; name?: string; slug?: string }): string {
    if (instructor.slug) return instructor.slug;
    const name = instructor.name?.toLowerCase().trim() || "";
    const id = instructor.id?.toLowerCase().trim() || "";

    const matched = FACULTY_MEMBERS.find(
      (f) =>
        f.id === id ||
        f.slug === id ||
        (f.name && name && f.name.toLowerCase().includes(name.replace("dr. ", "").replace("prof. ", ""))) ||
        (f.name && name && name.includes(f.name.toLowerCase().replace("dr. ", "").replace("prof. ", "")))
    );

    if (matched) return matched.slug;
    return id || "dr-junaid-javed";
  }
}
