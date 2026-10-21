export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string[];
  author: {
    name: string;
    role: string;
    avatarUrl: string;
  };
  thumbnailUrl: string;
  publishedAt: string;
  readTime: string;
  featured?: boolean;
}

const BLOG_POSTS: BlogPost[] = [
  {
    slug: "authority-of-scripture-sola-scriptura",
    title: "The Unfailing Authority of Scripture: Sola Scriptura and the Church Today",
    excerpt:
      "An examination of the historic Christian doctrine of biblical authority, inerrancy, and how the ecumenical creeds safeguard the gospel message against contemporary theological drifts.",
    content: `
# The Unfailing Authority of Scripture: Sola Scriptura and the Church Today

For two millennia, the Christian Church has stood upon the steadfast truth that the Holy Scriptures of the Old and New Testaments are the inspired, infallible, and authoritative Word of God. Amidst intellectual currents that challenge transcendent truth, reclaiming the historic doctrine of *Sola Scriptura* remains the foremost duty of pastors, scholars, and believers.

## 1. What Sola Scriptura Truly Means

A common misunderstanding in popular culture is confusing *Sola Scriptura* with *Nuda Scriptura* (the simplistic isolation of individual verses without historical context). The Protestant Reformers, following the patristic fathers (such as Athanasius, Augustine, and Irenaeus), never advocated for private doctrinal eccentricity.

Rather, *Sola Scriptura* affirms:
- **The Ultimate Norm of Faith**: Scripture alone is the supreme, inerrant court of appeal in all matters of Christian faith and morals.
- **The Secondary Authority of Creeds**: The historic ecumenical creeds (such as the Apostles', Nicene, and Chalcedonian) provide faithful ministerial summaries that reflect biblical revelation.
- **Sufficiency for Salvation**: Holy Scripture contains all things necessary for salvation, life, and godliness (2 Timothy 3:16–17; 2 Peter 1:3).

## 2. Inerrancy and Divine Inspiration

The Apostle Paul declared: *"All Scripture is breathed out by God and profitable for teaching, for reproof, for correction, and for training in righteousness"* (*theopneustos*, 2 Timothy 3:16). Because God Himself is the ultimate Author of Scripture, and because God cannot lie (Titus 1:2), Scripture is free from error in all that it affirms.

> "The Scriptures are the divine stylus guided by the Holy Spirit. To question their reliability is to question the faithfulness of the God who spoke them." — St. Augustine

## 3. Practical Implications for Ministry and Preaching

When the pulpit surrenders its confidence in the authority of Scripture, preaching dissolves into therapeutic moralism. Authentic biblical reformation begins when pastors return to:
1. **Expository Preaching**: Systematically unfolding the whole counsel of God from Genesis to Revelation.
2. **Grammatical-Historical Exegesis**: Grounding sermons in the original Greek and Hebrew texts rather than subjective impressions.
3. **Christ-Centered Proclamation**: Demonstrating how every narrative and covenant points ultimately to Jesus Christ and His finished redemptive work.

## Conclusion

The grass withers and the flower fades, but the Word of our God stands forever (Isaiah 40:8). In every generation, the Church flourishes when she unashamedly upholds the infallible Scriptures as the lamp unto her feet and the light unto her path.
    `,
    category: "Systematic Theology",
    tags: ["Scripture", "Inerrancy", "Sola Scriptura", "Reformation", "Theology Proper"],
    author: {
      name: "Dr. David Sterling, Th.D.",
      role: "Chair of Systematic Theology",
      avatarUrl: "/assets/img/teacher/teacher-1.png",
    },
    thumbnailUrl: "/assets/img/blog/blog-stories/blog-stories-thumb-1.jpg",
    publishedAt: "September 15, 2026",
    readTime: "8 min read",
    featured: true,
  },
  {
    slug: "importance-of-koine-greek-expository-preaching",
    title: "The Importance of Koine Greek in Expository Preaching",
    excerpt:
      "Why learning original biblical languages enhances pastoral faithfulness, protects against interpretive errors, and deepens sermon exegesis.",
    content: `
# The Importance of Koine Greek in Expository Preaching

When Martin Luther launched the European Reformation, he famously declared that the biblical languages are the scabbard that contains the sword of the Spirit. For the Christian pastor and serious student of the New Testament, understanding Koine Greek is not a pedantic luxury—it is an indispensable pastoral asset.

## 1. Seeing the Text in High Definition

Translations are magnificent gifts of God's common grace, but every translation is inherently an interpretation. Reading the New Testament in Greek enables the expositor to observe nuance:
- **Verbal Aspect**: Discerning between imperfective (ongoing), aoristic (summary), and perfective (completed state with abiding results) aspects.
- **Syntactical Relationships**: Tracing Paul's complex participial clauses in Ephesians 1 or Romans 8 that English translations frequently break apart.
- **Theological Wordplay**: Appreciating lexical parallels across the Johannine and Pauline corpuses.

## 2. Preventing Pulpit Errors

A working knowledge of Greek protects the congregation from sensationalist etymological fallacies (such as claiming *dunamis* in Romans 1:16 means the gospel is like 'dynamite', or misinterpreting *agape* and *phileo* in John 21). When the preacher handles the Greek text accurately:
- Textual confidence replaces anecdotal speculation.
- The congregation learns to trust the clarity and precision of divine revelation.

## 3. A Call to Daily Study

Pastors need not be world-class lexicographers to benefit from Greek. Dedicating 20 minutes each morning to reading a single paragraph of the Greek New Testament preserves linguistic agility and enriches sermon preparation for a lifetime of faithful gospel ministry.
    `,
    category: "Biblical Languages",
    tags: ["Koine Greek", "Exegesis", "Hermeneutics", "Preaching", "New Testament"],
    author: {
      name: "Dr. Sarah Machen, Ph.D.",
      role: "Professor of New Testament Exegesis",
      avatarUrl: "/assets/img/teacher/teacher-2.png",
    },
    thumbnailUrl: "/assets/img/blog/blog-stories/blog-stories-thumb-2.jpg",
    publishedAt: "September 10, 2026",
    readTime: "10 min read",
  },
  {
    slug: "early-church-council-of-nicaea",
    title: "The Early Church & The Nicene Creed (325 AD): Defending the Deity of Christ",
    excerpt:
      "A historical journey through the Arian controversy, Athanasius contra mundum, and the eternal formulation of Christ as consubstantial (homoousios) with the Father.",
    content: `
# The Early Church & The Nicene Creed (325 AD): Defending the Deity of Christ

In the summer of 325 AD, more than three hundred Christian bishops convened in the city of Nicaea (modern-day İznik, Turkey). Many of these church fathers bore physical scars from the Roman persecutions of Diocletian. They gathered not to innovate new doctrines, but to defend the faith once for all delivered to the saints.

## 1. The Threat of Arianism

Arius, a presbyter of Alexandria, taught that the Son had a beginning: *"There was a time when the Son was not."* He reasoned that if the Father begat the Son, the Son must be a creature, albeit the highest of all created beings.

This teaching struck at the very heart of the gospel. As the young deacon Athanasius rightly recognized:
- If Jesus Christ is a creature, He cannot save sinful humanity, for only God can bridge the infinite chasm of sin and death.
- If Jesus Christ is worshipped as a creature, the Church is guilty of idolatry.

## 2. Homoousios: True God of True God

To safeguard the biblical witness against ambiguous phrases, the Council adopted the decisive term **Homoousios** (*consubstantial*, or of the same essence):

> "We believe in one Lord Jesus Christ, the Son of God, begotten of the Father, only-begotten, that is, of the substance of the Father; God of God, Light of Light, true God of true God, begotten, not made, of one substance with the Father..."

Through this confession, the Council affirmed that the Son is co-eternal, co-equal, and eternally one with the Father.

## 3. The Nicene Legacy Today

The Nicene Creed remains the foundational confession of orthodox Christianity across Eastern Orthodox, Roman Catholic, and historic Protestant traditions. Studying historical theology reminds modern believers that we stand on the shoulders of faithful confessors who contended valiantly for the truth.
    `,
    category: "Church History",
    tags: ["Church History", "Patristics", "Nicaea", "Trinity", "Athanasius"],
    author: {
      name: "Rev. Dr. Samuel Rutherford, D.Min.",
      role: "Dean of Church History",
      avatarUrl: "/assets/img/teacher/teacher-5.png",
    },
    thumbnailUrl: "/assets/img/blog/blog-stories/blog-stories-thumb-3.jpg",
    publishedAt: "September 05, 2026",
    readTime: "11 min read",
  },
  {
    slug: "defending-the-resurrection-historical-evidences",
    title: "Defending the Resurrection: Historical Evidences for the Empty Tomb",
    excerpt:
      "Evaluating the historical testimony, eyewitness accounts, enemy attestation, and rapid rise of the early Church that demonstrate Jesus rose bodily from the grave.",
    content: `
# Defending the Resurrection: Historical Evidences for the Empty Tomb

The Apostle Paul asserted with radical honesty: *"If Christ has not been raised, then our preaching is in vain and your faith is in vain"* (1 Corinthians 15:14). Christianity is unique among world religions because it anchors its claims not in abstract mysticism, but in verifiable historical events that occurred in space and time.

## The Minimal Facts Framework

Historians—both Christian and secular—widely acknowledge several historical bedrock facts surrounding the life of Jesus of Nazareth:

1. **Jesus died by Roman crucifixion under Pontius Pilate**: Confirmed by Roman historian Tacitus, Jewish historian Josephus, and the Talmud.
2. **The Tomb was Empty**: The earliest Jewish polemic (Matthew 28:11–15; Justin Martyr) did not claim the body remained in the tomb, but alleged the disciples stole it—unwittingly acknowledging the empty tomb.
3. **Multiple Eyewitness Appearances**: Over 500 individuals, skeptics (such as James, the brother of Jesus), and fierce persecutors (Saul of Tarsus) experienced bodily appearances of the risen Christ.
4. **The Transformation of the Apostles**: Demoralized and terrified fishermen transformed overnight into bold martyrs who willingly gave their lives for their testimony.

## Why Naturalistic Hypotheses Fail

Alternative explanations—such as hallucination theories, stolen body hypotheses, or swoon theories—collapse under historical scrutiny. Hallucinations are individual psychological phenomena; they do not occur to groups of hundreds simultaneously, nor do they produce an empty tomb.

## The Pastoral Power of the Empty Tomb

The resurrection is not merely an intellectual debate; it is the guarantee of our justification (Romans 4:25) and the cosmic firstfruits of the new creation (1 Corinthians 15:20). Because Christ lives, we have a living hope that cannot perish, spoil, or fade.
    `,
    category: "Christian Apologetics",
    tags: ["Apologetics", "Resurrection", "Historical Evidences", "Gospels", "Gospel Defense"],
    author: {
      name: "Prof. Marcus Aurelius Hodge, Th.M.",
      role: "Lecturer in Apologetics & Philosophy",
      avatarUrl: "/assets/img/teacher/teacher-3.png",
    },
    thumbnailUrl: "/assets/img/blog/blog-stories/blog-stories-thumb-4.jpg",
    publishedAt: "August 28, 2026",
    readTime: "9 min read",
  },
  {
    slug: "redemptive-historical-hermeneutics-christ-in-all-scriptures",
    title: "Redemptive-Historical Hermeneutics: Beholding Christ in the Old Testament",
    excerpt:
      "How covenant theology and biblical typology reveal Jesus Christ throughout the Law, the Prophets, and the Psalms without resorting to allegorical eisegesis.",
    content: `
# Redemptive-Historical Hermeneutics: Beholding Christ in the Old Testament

On the road to Emmaus, the risen Christ walked alongside two grieving disciples. Opening the Scriptures, He showed them: *"Beginning with Moses and all the Prophets, he interpreted to them in all the Scriptures the things concerning himself"* (Luke 24:27).

## 1. The Unity of the Canon

The Bible is not a collection of disconnected moral tales or ancient myths; it is a single, unfolding drama of redemption centered upon the person and work of Jesus Christ:
- The **Law** shows God's holy standard and our need for a Priest and Sacrifice.
- The **Historical Books** demonstrate the longing for a righteous, eternal King.
- The **Prophets** anticipate the New Covenant, the Suffering Servant, and the outpouring of the Holy Spirit.

## 2. Typology vs. Allegory

Faithful exegesis distinguishes between arbitrary allegory and divinely ordained **typology**:
- **Allegory** superimposes hidden meanings unrelated to the author's original historical context.
- **Typology** recognizes historical persons (Adam, David, Moses), institutions (the sacrificial system, the priesthood), and events (the Exodus, the Passover) that God sovereignly designed as shadows pointing toward their ultimate fulfillment in Christ.

## Conclusion

When we read the Old Testament through the lens of redemptive history, the Scriptures shine with christocentric glory, fueling our adoration and empowering our proclamation.
    `,
    category: "Biblical Studies",
    tags: ["Biblical Theology", "Covenant", "Typology", "Old Testament", "Christology"],
    author: {
      name: "Dr. Sarah Machen, Ph.D.",
      role: "Professor of New Testament Exegesis",
      avatarUrl: "/assets/img/teacher/teacher-2.png",
    },
    thumbnailUrl: "/assets/img/blog/blog-stories/blog-stories-thumb-5.jpg",
    publishedAt: "August 20, 2026",
    readTime: "8 min read",
  },
];

export class BlogService {
  static getAllPosts(): BlogPost[] {
    return BLOG_POSTS;
  }

  static getPostBySlug(slug: string): BlogPost | null {
    return BLOG_POSTS.find((p) => p.slug === slug) || null;
  }

  static getFeaturedPost(): BlogPost {
    return BLOG_POSTS.find((p) => p.featured) || BLOG_POSTS[0];
  }

  static getRecentPosts(limit = 4): BlogPost[] {
    return BLOG_POSTS.slice(0, limit);
  }

  static getCategories(): { name: string; count: number }[] {
    const counts: Record<string, number> = {};
    BLOG_POSTS.forEach((p) => {
      counts[p.category] = (counts[p.category] || 0) + 1;
    });
    return Object.entries(counts).map(([name, count]) => ({ name, count }));
  }

  static getAllTags(): string[] {
    const set = new Set<string>();
    BLOG_POSTS.forEach((p) => p.tags.forEach((t) => set.add(t)));
    return Array.from(set);
  }
}
