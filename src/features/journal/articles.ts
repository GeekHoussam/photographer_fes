import { siteConfig } from "@/config/site";
import type { JournalArticle, JournalRichTextSegment } from "@/types/content";

const strong = (text: string): JournalRichTextSegment => ({
  text,
  emphasis: "strong",
});

const em = (text: string): JournalRichTextSegment => ({
  text,
  emphasis: "em",
});

export const journalArticles = [
  {
    slug: "photographe-mariage-fes",
    order: 1,
    author: siteConfig.name,
    images: [
      {
        src: "/images/journal/photographe-mariage-fes/beach-ceremony.webp",
        width: 2400,
        height: 1597,
        alt: {
          fr: "Cérémonie de mariage sur une plage sous une arche fleurie",
          en: "Beach wedding ceremony beneath a floral arch",
          ar: "مراسم زفاف على شاطئ تحت قوس مزين بالزهور",
        },
      },
      {
        src: "/images/journal/photographe-mariage-fes/bride-courtyard.webp",
        width: 1597,
        height: 2400,
        alt: {
          fr: "Une mariée avance dans une cour ensoleillée, vue de dos",
          en: "A bride walking through a sunlit courtyard, seen from behind",
          ar: "عروس تمشي في فناء مشمس، كما تبدو من الخلف",
        },
      },
      {
        src: "/images/journal/photographe-mariage-fes/wedding-rings.webp",
        width: 2400,
        height: 1600,
        alt: {
          fr: "Les mains d’un couple portant leurs alliances",
          en: "A couple’s hands wearing their wedding rings",
          ar: "يدا عروسين يرتديان خاتمي الزواج",
        },
      },
    ],
    videos: [
      {
        videoId: "pgkUHijHiPc",
        youtubeUrl: "https://www.youtube.com/watch?v=pgkUHijHiPc",
        aspect: "landscape",
        label: {
          fr: "Film de mariage au Maroc présenté dans l’article",
          en: "Morocco wedding film featured in the article",
          ar: "فيلم زفاف في المغرب وارد في المقال",
        },
      },
    ],
    content: {
      fr: {
        title: "Votre photographe de mariage à Fès",
        summary:
          "Mohammed Laâchach est photographe professionnel et vidéaste haut de gamme basé à Fès. Il propose des services sur mesure en photographie, elopements et films de mariage, de la médina aux riads les plus luxueux.",
        metaTitle: "Photographe de mariage à Fès",
        metaDescription:
          "Découvrez l’approche de Mohammed Laâchach pour la photographie et la vidéo de mariage à Fès : lumière, lieux, logistique, NOM Films et questions fréquentes.",
        body: [
          {
            type: "heading",
            level: 2,
            text: "L’élégance intemporelle : l’importance d’un photographe de mariage à Fès",
          },
          {
            type: "paragraph",
            content: [
              "Organiser une célébration dans la capitale spirituelle du Maroc est un privilège exceptionnel. Que vous planifiiez une cérémonie traditionnelle grandiose ou un elopement intime, le choix de votre artiste visuel est déterminant. En tant que ",
              strong("photographe à Fès"),
              " spécialisé dans l’événementiel de luxe, je m’engage à transformer vos instants éphémères en œuvres d’art éternelles.",
            ],
          },
          {
            type: "paragraph",
            content: [
              "La ",
              strong("photographie de mariage"),
              " contemporaine ne consiste plus seulement à poser devant l’objectif. Il s’agit de comprendre la dynamique unique de chaque couple et de l’harmoniser avec la majesté architecturale des lieux. Mon approche exclusive combine le photojournalisme discret et la direction artistique de mode pour un rendu final digne des grands magazines.",
            ],
          },
          {
            type: "heading",
            level: 3,
            text: "La magie de la médina pour votre séance photo de couple",
          },
          {
            type: "paragraph",
            content: [
              "Fès offre un décor cinématographique incomparable, mais aussi très exigeant. Les ruelles labyrinthiques et historiques de la ",
              strong("médina de Fès"),
              " exigent une véritable maîtrise technique, tout particulièrement pour gérer les contrastes forts et les ombres portées si caractéristiques de l’architecture locale. Fort de mon ancrage local, je connais chaque recoin caché et chaque puits de lumière pour sublimer votre ",
              strong("séance photo de couple"),
              ".",
            ],
          },
          {
            type: "paragraph",
            content: [
              "La logistique dans la vieille ville peut être complexe et imprévisible pour les photographes non initiés. Je vous guide avec bienveillance à travers ces espaces historiques, assurant un shooting photo à Fès d’une fluidité absolue, à l’abri des foules. Votre confort et votre sérénité restent mes priorités absolues tout au long de notre collaboration artistique.",
            ],
          },
          { type: "image", imageIndex: 1 },
          {
            type: "heading",
            level: 2,
            text: "L’expertise locale : lumière, lieux et logistique",
          },
          {
            type: "paragraph",
            content: [
              "Une connaissance millimétrée de la ville est la véritable signature d’un ",
              strong("photographe professionnel"),
              " d’excellence. La lumière marocaine est sublime, vibrante, mais elle change extrêmement vite. Savoir anticiper précisément la ",
              em("Golden Hour"),
              " — cette lumière dorée et douce de fin de journée — est essentiel pour obtenir des clichés chaleureux, romantiques et flatteurs.",
            ],
          },
          {
            type: "heading",
            level: 3,
            text: "Capturer l’essence des lieux de réception prestigieux",
          },
          {
            type: "paragraph",
            content: [
              "Fès regorge de joyaux architecturaux, de cours en zelliges et de terrasses surplombant la ville, parfaits pour célébrer votre union. Lors de mes reportages exclusifs, j’ai l’opportunité de mettre en lumière la grandeur d’établissements renommés. Voici quelques-uns des écrins luxueux où j’ai le privilège d’opérer en tant que ",
              strong("photographe de mariage à Fès"),
              " :",
            ],
          },
          {
            type: "list",
            items: [
              [
                strong("Palais Faraj : "),
                "offrant une vue panoramique époustouflante sur l’ancienne médina, ce palais est idéal pour des portraits majestueux au moment précis du coucher du soleil.",
              ],
              [
                strong("Riad Fès : "),
                "l’incarnation même du luxe arabo-andalou, offrant un décor parfait pour des préparatifs élégants grâce à sa cour intérieure baignée d’une lumière douce et diffuse.",
              ],
              [
                strong("Les Mérinides : "),
                "perché sur les hauteurs stratégiques, cet emplacement mythique offre une toile de fond spectaculaire sur toute la vieille ville, idéale pour des séances à la ",
                em("Golden Hour"),
                ".",
              ],
              [
                strong("Jnan Sbil : "),
                "ces somptueux jardins andalous offrent un écrin de verdure luxuriant, garantissant des clichés romantiques et apaisants, loin de l’effervescence urbaine.",
              ],
            ],
          },
          {
            type: "paragraph",
            content: [
              "Maîtriser la colorimétrie unique des céramiques de ces riads historiques garantit que chaque image traduira fidèlement l’atmosphère magique de votre célébration.",
            ],
          },
          { type: "image", imageIndex: 2 },
          {
            type: "heading",
            level: 2,
            text: "Au-delà de l’image fixe : votre vidéaste de mariage au Maroc",
          },
          {
            type: "paragraph",
            content: [
              "Si la photographie fige un instant d’émotion pour l’éternité, la vidéo, quant à elle, capture le mouvement, le frisson, le son et l’émotion brute. Des larmes de joie lors des discours aux rires spontanés, l’image animée offre une dimension supplémentaire. C’est pour répondre à cette exigence que ",
              strong("NOM Films"),
              " a été créé.",
            ],
          },
          {
            type: "heading",
            level: 3,
            text: "NOM Films : l’excellence cinématographique à Fès",
          },
          {
            type: "paragraph",
            content: [
              "À travers ",
              strong("NOM Films"),
              ", mon équipe et moi-même déployons une expertise reconnue de vidéaste de mariage au Maroc. Nous utilisons du matériel cinématographique de pointe pour réaliser de véritables films narratifs. Nous racontons votre histoire avec un étalonnage colorimétrique soigné, un montage dynamique et un sound design immersif qui ravive vos souvenirs.",
            ],
          },
          {
            type: "paragraph",
            content: [
              "Faire appel au même expert pour endosser les rôles de photographe à Fès et de réalisateur vidéo assure une cohérence visuelle parfaite. Nos équipes travaillent en totale synergie, sans jamais se gêner ni perturber vos invités, pour vous livrer un patrimoine familial inestimable.",
            ],
          },
          { type: "videos", videoIndexes: [0] },
        ],
        faqIntroduction:
          "Pour vous accompagner et faciliter l’organisation de votre événement, voici les réponses directes aux interrogations les plus courantes de mes futurs mariés. Ces informations sont essentielles pour préparer votre grand jour.",
        faqs: [
          {
            question: "Pourquoi choisir Photographe Fès pour votre mariage ?",
            answer: [
              "Choisir ",
              strong("Photographe Fès"),
              " garantit l’intervention de Mohammed Laâchach, un expert local reconnu qui maîtrise parfaitement la lumière ambiante, la logistique et les lieux emblématiques de la ville. Cette expertise assure des images de haute qualité et élégantes, tout en sécurisant l’organisation de vos prises de vue dans les environnements complexes de la ville.",
            ],
          },
          {
            question:
              "Quel est notre processus de photographie de mariage à Fès ?",
            answer: [
              "Notre processus de photographie de mariage à Fès se déroule en quatre étapes strictes. Il comprend une consultation initiale pour cerner votre vision, une planification détaillée incluant le repérage et le timing de la Golden Hour, le reportage discret le jour J et, enfin, une postproduction minutieuse garantissant un rendu luxueux.",
            ],
          },
          {
            question: "À quoi sert une vidéo pour un couple à Fès ?",
            answer: [
              "Une vidéo permet de capturer l’ambiance sonore, l’énergie des festivités traditionnelles, le mouvement des tenues et les vœux échangés, des éléments impossibles à figer en photo. Réalisée de manière professionnelle, elle complète le reportage photographique en offrant un souvenir immersif et vivant de votre union.",
            ],
          },
        ],
        contactTitle: "Contactez votre photographe de mariage à Fès",
        contactParagraphs: [
          [
            "Votre mariage est une aventure unique qui mérite un héritage visuel absolument irréprochable. Ne laissez pas la capture de ces moments inoubliables au hasard. Faites confiance à un expert de l’image dont l’expérience éprouvée et la sensibilité artistique mettront en lumière chaque émotion de votre grand jour.",
          ],
          [
            "Je vous invite à consulter mon ",
            strong("Profil d’Entreprise Google"),
            ". Vous y découvrirez les témoignages authentiques et les avis des couples locaux et internationaux qui m’ont confié la mémoire de leur ",
            em("Destination Wedding"),
            ".",
          ],
          [
            strong("Prêt à immortaliser votre histoire ? "),
            "Contactez-moi directement pour vérifier mes disponibilités et obtenir une proposition tarifaire sur mesure.",
          ],
        ],
        contactAction: "Présenter votre mariage et demander un devis",
      },
      en: {
        title: "Your wedding photographer in Fez",
        summary:
          "Mohammed Laâchach is a professional photographer and high-end filmmaker based in Fez. He provides tailored photography, elopement, and wedding film services, from the medina to the city’s most luxurious riads.",
        metaTitle: "Wedding photographer in Fez",
        metaDescription:
          "Discover Mohammed Laâchach’s approach to wedding photography and film in Fez, covering light, locations, logistics, NOM Films, and frequently asked questions.",
        body: [
          {
            type: "heading",
            level: 2,
            text: "Timeless elegance: why a wedding photographer in Fez matters",
          },
          {
            type: "paragraph",
            content: [
              "Holding a celebration in Morocco’s spiritual capital is an exceptional privilege. Whether you are planning a grand traditional ceremony or an intimate elopement, choosing the right visual artist is decisive. As a ",
              strong("photographer in Fez"),
              " specialising in luxury events, I am committed to transforming fleeting moments into lasting works of art.",
            ],
          },
          {
            type: "paragraph",
            content: [
              "Contemporary ",
              strong("wedding photography"),
              " is no longer simply about posing in front of a camera. It means understanding the unique dynamic of each couple and harmonising it with the architectural majesty of the setting. My approach combines discreet photojournalism with fashion-led art direction for a final result worthy of a leading magazine.",
            ],
          },
          {
            type: "heading",
            level: 3,
            text: "The magic of the medina for your couple’s photo session",
          },
          {
            type: "paragraph",
            content: [
              "Fez offers an incomparable cinematic backdrop, but it is also highly demanding. The historic, labyrinthine lanes of the ",
              strong("Fez medina"),
              " require genuine technical control, particularly when managing strong contrast and the hard shadows that characterise the local architecture. With deep local knowledge, I know its hidden corners and pockets of light and use them to elevate your ",
              strong("couple’s photo session"),
              ".",
            ],
          },
          {
            type: "paragraph",
            content: [
              "Logistics in the old city can be complex and unpredictable for photographers who do not know it well. I guide you thoughtfully through these historic spaces, keeping your Fez photo session smooth and away from the crowds. Your comfort and peace of mind remain my priorities throughout our creative collaboration.",
            ],
          },
          { type: "image", imageIndex: 1 },
          {
            type: "heading",
            level: 2,
            text: "Local expertise: light, locations, and logistics",
          },
          {
            type: "paragraph",
            content: [
              "Detailed knowledge of the city is the true hallmark of an excellent ",
              strong("professional photographer"),
              ". Moroccan light is beautiful and vibrant, but it changes extremely quickly. Anticipating the ",
              em("Golden Hour"),
              " — the soft, golden light at the end of the day — is essential for warm, romantic, and flattering photographs.",
            ],
          },
          {
            type: "heading",
            level: 3,
            text: "Capturing the character of prestigious reception venues",
          },
          {
            type: "paragraph",
            content: [
              "Fez is rich in architectural treasures, zellige courtyards, and terraces overlooking the city, all ideal places to celebrate your union. During my exclusive assignments, I have the opportunity to highlight renowned venues. These are some of the luxurious settings where I work as a ",
              strong("wedding photographer in Fez"),
              ":",
            ],
          },
          {
            type: "list",
            items: [
              [
                strong("Palais Faraj: "),
                "with its breathtaking panoramic view over the old medina, the palace is ideal for majestic portraits at the precise moment of sunset.",
              ],
              [
                strong("Riad Fez: "),
                "an expression of Arab-Andalusian luxury and a perfect setting for elegant preparations, thanks to an inner courtyard filled with soft, diffused light.",
              ],
              [
                strong("Les Mérinides: "),
                "set on the heights above the city, this landmark provides a spectacular background across the old city and is ideal for ",
                em("Golden Hour"),
                " sessions.",
              ],
              [
                strong("Jnan Sbil: "),
                "these Andalusian gardens provide a lush green setting for calm, romantic photographs away from the bustle of the city.",
              ],
            ],
          },
          {
            type: "paragraph",
            content: [
              "Controlling the distinctive colour of the ceramics in these historic riads ensures that every image remains faithful to the atmosphere of your celebration.",
            ],
          },
          { type: "image", imageIndex: 2 },
          {
            type: "heading",
            level: 2,
            text: "Beyond the still image: your wedding filmmaker in Morocco",
          },
          {
            type: "paragraph",
            content: [
              "Photography preserves a moment of emotion, while film captures movement, excitement, sound, and raw feeling. From tears of joy during speeches to spontaneous laughter, moving images add another dimension. ",
              strong("NOM Films"),
              " was created to meet that need.",
            ],
          },
          {
            type: "heading",
            level: 3,
            text: "NOM Films: cinematic expertise in Fez",
          },
          {
            type: "paragraph",
            content: [
              "Through ",
              strong("NOM Films"),
              ", my team and I bring recognised expertise in wedding filmmaking across Morocco. We use advanced cinema equipment to create genuine narrative films, telling your story through careful colour grading, dynamic editing, and immersive sound design that brings your memories back to life.",
            ],
          },
          {
            type: "paragraph",
            content: [
              "Choosing the same specialist as both your photographer in Fez and your film director creates complete visual consistency. Our teams work in close coordination without getting in one another’s way or disturbing your guests, creating an invaluable record for your family.",
            ],
          },
          { type: "videos", videoIndexes: [0] },
        ],
        faqIntroduction:
          "To support you and make planning easier, here are direct answers to the questions I most often receive from couples preparing their wedding. They provide important guidance for the day ahead.",
        faqs: [
          {
            question: "Why choose Photographer Fez for your wedding?",
            answer: [
              "Choosing ",
              strong("Photographer Fez"),
              " means working with Mohammed Laâchach, a recognised local specialist who understands the city’s ambient light, logistics, and landmark locations. That expertise produces elegant, high-quality images while making photo sessions in complex city environments easier to organise.",
            ],
          },
          {
            question: "What is our wedding photography process in Fez?",
            answer: [
              "Our wedding photography process in Fez follows four clear stages: an initial consultation to understand your vision; detailed planning, including location scouting and Golden Hour timing; discreet coverage on the wedding day; and careful post-production for a polished, luxurious result.",
            ],
          },
          {
            question: "What does a wedding film add for a couple in Fez?",
            answer: [
              "Film captures the sound of the celebration, the energy of traditional festivities, the movement of the clothes, and the vows being exchanged — elements that a still photograph cannot preserve. Professionally made, it complements the photography with an immersive, living memory of your union.",
            ],
          },
        ],
        contactTitle: "Contact your wedding photographer in Fez",
        contactParagraphs: [
          [
            "Your wedding is a unique adventure that deserves an impeccable visual legacy. Do not leave these unforgettable moments to chance. Trust an experienced image-maker whose artistic sensitivity will bring every emotion of your day to the fore.",
          ],
          [
            "I invite you to view my ",
            strong("Google Business Profile"),
            ", where you can read authentic feedback from local and international couples who entrusted me with the memory of their ",
            em("destination wedding"),
            ".",
          ],
          [
            strong("Ready to preserve your story? "),
            "Contact me directly to check availability and request a tailored quotation.",
          ],
        ],
        contactAction: "Describe your wedding and request a quotation",
      },
      ar: {
        title: "مصور حفل زفافك في فاس",
        summary:
          "Mohammed Laâchach مصور فوتوغرافي محترف وصانع أفلام راقية مقيم في فاس. يقدم خدمات مخصصة لتصوير حفلات الزفاف الصغيرة والكبيرة وإنتاج أفلامها، من المدينة العتيقة إلى أرقى رياضات فاس.",
        metaTitle: "مصور حفلات زفاف في فاس",
        metaDescription:
          "اكتشف منهجية Mohammed Laâchach في تصوير حفلات الزفاف فوتوغرافيًا وبالفيديو في فاس، من الضوء والأماكن إلى الجوانب التنظيمية وNOM Films والأسئلة الشائعة.",
        body: [
          {
            type: "heading",
            level: 2,
            text: "أناقة خالدة: أهمية مصور حفلات الزفاف في فاس",
          },
          {
            type: "paragraph",
            content: [
              "إقامة احتفال في العاصمة الروحية للمغرب امتياز استثنائي. سواء كنت تخطط لمراسم تقليدية كبيرة أو حفل زفاف حميمي، فإن اختيار الفنان البصري المناسب قرار حاسم. وبصفتي ",
              strong("مصورًا فوتوغرافيًا في فاس"),
              " متخصصًا في الفعاليات الراقية، ألتزم بتحويل لحظاتكم العابرة إلى أعمال فنية باقية.",
            ],
          },
          {
            type: "paragraph",
            content: [
              "لم يعد ",
              strong("تصوير حفلات الزفاف"),
              " المعاصر مجرد وقوف أمام العدسة، بل أصبح يقوم على فهم العلاقة الفريدة بين كل عروسين ومواءمتها مع روعة العمارة المحيطة. تجمع منهجيتي بين التصوير الصحفي الهادئ والتوجيه الفني المستلهم من عالم الأزياء، للحصول على نتيجة تليق بالمجلات المرموقة.",
            ],
          },
          {
            type: "heading",
            level: 3,
            text: "سحر المدينة العتيقة في جلسة تصوير العروسين",
          },
          {
            type: "paragraph",
            content: [
              "توفر فاس خلفية سينمائية لا مثيل لها، لكنها تتطلب خبرة كبيرة أيضًا. فالأزقة التاريخية المتشابكة في ",
              strong("مدينة فاس العتيقة"),
              " تحتاج إلى تحكم تقني حقيقي، ولا سيما للتعامل مع التباين القوي والظلال الحادة التي تميز العمارة المحلية. وبفضل معرفتي العميقة بالمدينة، أعرف زواياها الخفية ومنافذ الضوء فيها لأبرز جمال ",
              strong("جلسة تصوير العروسين"),
              ".",
            ],
          },
          {
            type: "paragraph",
            content: [
              "قد تكون الجوانب التنظيمية في المدينة القديمة معقدة وغير متوقعة للمصورين غير الملمين بها. أرافقكم بعناية عبر هذه الفضاءات التاريخية لتسير جلسة التصوير في فاس بسلاسة بعيدًا عن الازدحام. ويظل راحتكم واطمئنانكم من أولوياتي طوال تعاوننا الإبداعي.",
            ],
          },
          { type: "image", imageIndex: 1 },
          {
            type: "heading",
            level: 2,
            text: "الخبرة المحلية: الضوء والأماكن والجوانب التنظيمية",
          },
          {
            type: "paragraph",
            content: [
              "المعرفة الدقيقة بالمدينة هي السمة الحقيقية لأي ",
              strong("مصور فوتوغرافي محترف"),
              " متميز. فالضوء المغربي جميل ونابض بالحياة، لكنه يتغير بسرعة كبيرة. ويُعد توقع ",
              em("الساعة الذهبية"),
              " بدقة، وهي ضوء نهاية النهار الناعم والدافئ، أمرًا أساسيًا للحصول على صور دافئة ورومانسية وجذابة.",
            ],
          },
          {
            type: "heading",
            level: 3,
            text: "إبراز طابع أماكن الاستقبال المرموقة",
          },
          {
            type: "paragraph",
            content: [
              "تزخر فاس بكنوز معمارية وأفنية مزينة بالزليج وشرفات تطل على المدينة، وهي أماكن مثالية للاحتفال بزواجكم. وخلال تغطياتي الخاصة، تتاح لي فرصة إبراز روعة مؤسسات معروفة. وفيما يلي بعض الأماكن الراقية التي أعمل فيها بصفتي ",
              strong("مصور حفلات زفاف في فاس"),
              ":",
            ],
          },
          {
            type: "list",
            items: [
              [
                strong("Palais Faraj: "),
                "يطل هذا القصر على المدينة العتيقة بمنظر بانورامي أخاذ، ويعد مثاليًا لصور مهيبة في لحظة غروب الشمس.",
              ],
              [
                strong("Riad Fès: "),
                "يجسد الفخامة العربية الأندلسية ويوفر إطارًا مثاليًا لتحضيرات أنيقة بفضل فنائه الداخلي المغمور بضوء ناعم وموزع.",
              ],
              [
                strong("Les Mérinides: "),
                "يقع في مرتفعات المدينة ويوفر خلفية خلابة تمتد على المدينة القديمة بأكملها، ما يجعله مثاليًا لجلسات ",
                em("الساعة الذهبية"),
                ".",
              ],
              [
                strong("Jnan Sbil: "),
                "توفر هذه الحدائق الأندلسية الغناء إطارًا أخضر لصور رومانسية وهادئة بعيدًا عن صخب المدينة.",
              ],
            ],
          },
          {
            type: "paragraph",
            content: [
              "يضمن التحكم في الألوان المميزة لخزف هذه الرياضات التاريخية أن تنقل كل صورة أجواء احتفالكم بصدق.",
            ],
          },
          { type: "image", imageIndex: 2 },
          {
            type: "heading",
            level: 2,
            text: "ما وراء الصورة الثابتة: صانع فيلم زفافك في المغرب",
          },
          {
            type: "paragraph",
            content: [
              "إذا كانت الصورة الفوتوغرافية تحفظ لحظة عاطفية، فإن الفيديو يلتقط الحركة والانفعال والصوت والمشاعر في صورتها الخام. ومن دموع الفرح أثناء الكلمات إلى الضحكات العفوية، تضيف الصورة المتحركة بعدًا آخر. ومن أجل تلبية هذه الحاجة أُنشئت ",
              strong("NOM Films"),
              ".",
            ],
          },
          {
            type: "heading",
            level: 3,
            text: "NOM Films: خبرة سينمائية في فاس",
          },
          {
            type: "paragraph",
            content: [
              "من خلال ",
              strong("NOM Films"),
              " أقدم أنا وفريقي خبرة معروفة في صناعة أفلام الزفاف في مختلف أنحاء المغرب. نستخدم معدات سينمائية متقدمة لإنجاز أفلام سردية حقيقية، ونروي قصتكم بمعالجة دقيقة للألوان ومونتاج ديناميكي وتصميم صوتي غامر يعيد ذكرياتكم إلى الحياة.",
            ],
          },
          {
            type: "paragraph",
            content: [
              "يضمن اختيار الخبير نفسه للتصوير الفوتوغرافي في فاس وإخراج الفيديو اتساقًا بصريًا كاملًا. تعمل فرقنا بتناغم تام من دون أن يعيق بعضها بعضًا أو يزعج ضيوفكم، لتقديم سجل عائلي لا يقدر بثمن.",
            ],
          },
          { type: "videos", videoIndexes: [0] },
        ],
        faqIntroduction:
          "لمساعدتكم وتيسير تنظيم مناسبتكم، إليكم إجابات مباشرة عن أكثر الأسئلة التي أتلقاها من المقبلين على الزواج. توفر هذه المعلومات إرشادات مهمة للاستعداد ليومكم الكبير.",
        faqs: [
          {
            question: "لماذا تختار مصورًا من فاس لحفل زفافك؟",
            answer: [
              "اختيار ",
              strong("مصور فاس"),
              " يعني العمل مع Mohammed Laâchach، وهو خبير محلي يعرف جيدًا ضوء المدينة الطبيعي وجوانبها التنظيمية ومعالمها البارزة. وتضمن هذه الخبرة صورًا أنيقة وعالية الجودة، مع تسهيل تنظيم جلسات التصوير في بيئات المدينة المعقدة.",
            ],
          },
          {
            question: "ما مراحل تصوير حفل زفاف في فاس؟",
            answer: [
              "تمر عملية تصوير حفل الزفاف في فاس بأربع مراحل واضحة: استشارة أولية لفهم رؤيتكم، وتخطيط مفصل يشمل معاينة المواقع وتوقيت الساعة الذهبية، وتغطية هادئة في يوم الزفاف، ثم معالجة دقيقة للصور للحصول على نتيجة راقية ومتقنة.",
            ],
          },
          {
            question: "ماذا يضيف فيلم الزفاف للعروسين في فاس؟",
            answer: [
              "يلتقط الفيلم أصوات الاحتفال وطاقة الطقوس التقليدية وحركة الملابس وتبادل العهود، وهي عناصر لا تستطيع الصورة الثابتة حفظها. وعندما يُنجز باحتراف، يكمل التغطية الفوتوغرافية بذكرى حية وغامرة لزواجكم.",
            ],
          },
        ],
        contactTitle: "تواصل مع مصور حفل زفافك في فاس",
        contactParagraphs: [
          [
            "حفل زفافكم تجربة فريدة تستحق إرثًا بصريًا متقنًا. لا تتركوا توثيق هذه اللحظات التي لا تنسى للصدفة. ثقوا بصانع صور ذي خبرة وحس فني يبرز كل مشاعر يومكم الكبير.",
          ],
          [
            "أدعوكم إلى الاطلاع على ",
            strong("ملفي التجاري على Google"),
            "، حيث يمكنكم قراءة شهادات وآراء حقيقية لأزواج من المغرب وخارجه ائتمنوني على ذكرى ",
            em("حفل زفافهم في وجهة سفر"),
            ".",
          ],
          [
            strong("هل أنتم مستعدون لتخليد قصتكم؟ "),
            "تواصلوا معي مباشرة للتحقق من المواعيد المتاحة وطلب عرض سعر مخصص.",
          ],
        ],
        contactAction: "عرّف بحفل زفافك واطلب عرض سعر",
      },
    },
  },
  {
    slug: "photographe-evenementiel-fes",
    order: 2,
    author: siteConfig.name,
    images: [
      {
        src: "/images/journal/photographe-evenementiel-fes/gitex-handshake.webp",
        width: 2400,
        height: 1600,
        alt: {
          fr: "Poignée de main lors d’une cérémonie au GITEX Africa Morocco 2024",
          en: "Handshake at a GITEX Africa Morocco 2024 ceremony",
          ar: "مصافحة خلال مراسم في GITEX Africa Morocco 2024",
        },
      },
      {
        src: "/images/journal/photographe-evenementiel-fes/event-conversation.webp",
        width: 2400,
        height: 1605,
        alt: {
          fr: "Participants en discussion au milieu de caméras lors d’un événement professionnel",
          en: "Attendees speaking amid cameras at a professional event",
          ar: "مشاركون يتحدثون وسط كاميرات خلال فعالية مهنية",
        },
      },
      {
        src: "/images/journal/photographe-evenementiel-fes/fez-meknes-travel-days.webp",
        width: 2400,
        height: 1603,
        alt: {
          fr: "Portrait de groupe devant le décor Fez-Meknes Travel Days",
          en: "Group portrait in front of the Fez-Meknes Travel Days display",
          ar: "صورة جماعية أمام واجهة Fez-Meknes Travel Days",
        },
      },
    ],
    videos: [
      {
        videoId: "HmHS5l-KxUw",
        youtubeUrl: "https://www.youtube.com/watch?v=HmHS5l-KxUw",
        aspect: "landscape",
        label: {
          fr: "Couverture vidéo d’un événement professionnel à Fès — première vidéo",
          en: "Professional event coverage in Fez — first video",
          ar: "تغطية فيديو لفعالية مهنية في فاس — الفيديو الأول",
        },
      },
      {
        videoId: "2qof4UTBzZk",
        youtubeUrl: "https://www.youtube.com/watch?v=2qof4UTBzZk",
        aspect: "landscape",
        label: {
          fr: "Couverture vidéo d’un événement professionnel à Fès — deuxième vidéo",
          en: "Professional event coverage in Fez — second video",
          ar: "تغطية فيديو لفعالية مهنية في فاس — الفيديو الثاني",
        },
      },
    ],
    content: {
      fr: {
        title: "Revivez votre événement en photo et vidéo",
        summary:
          "Notre agence audiovisuelle propose une couverture média hybride, en photo et en vidéo, pour les événements professionnels à Fès, des séminaires d’entreprise aux conférences et soirées de gala.",
        metaTitle: "Photographe événementiel à Fès",
        metaDescription:
          "Couverture photo et vidéo d’événements professionnels à Fès : reportage corporate, aftermovie, lieux B2B, délais de livraison et questions fréquentes.",
        body: [
          {
            type: "heading",
            level: 2,
            text: "L’importance stratégique d’un photographe événementiel à Fès pour votre marque",
          },
          {
            type: "paragraph",
            content: [
              "Organiser un événement professionnel représente un investissement majeur en temps et en budget pour toute entreprise. Pour capitaliser sur ce moment fort, la création de contenus visuels impactants est absolument indispensable. Faire appel à un ",
              strong("photographe événementiel à Fès"),
              " vous permet de pérenniser cet investissement et de valoriser durablement votre image de marque auprès de vos collaborateurs et clients.",
            ],
          },
          {
            type: "paragraph",
            content: [
              "Nous comprenons parfaitement les enjeux B2B et l’exigence d’une communication visuelle irréprochable. En tant que photographe à Fès expérimenté, notre mission est de capturer l’essence de votre événement, les moments d’échange et l’ambiance, sans jamais perturber le bon déroulement de votre programme.",
            ],
          },
          {
            type: "heading",
            level: 3,
            text: "Un reportage photo corporate axé sur le retour sur investissement",
          },
          {
            type: "paragraph",
            content: [
              "La photographie institutionnelle et événementielle ne s’improvise pas. Notre approche ciblée du ",
              strong("reportage photo"),
              " corporate consiste à anticiper et isoler les moments clés : poignées de main stratégiques, interventions percutantes des conférenciers et niveau d’engagement de votre audience.",
            ],
          },
          {
            type: "paragraph",
            content: [
              "Chaque cliché est minutieusement pensé pour être réutilisé dans vos rapports annuels, vos dossiers de presse ou vos publications LinkedIn. Un bon photographe d’événement à Fès sait que ces images sont de véritables outils de conversion, de prospection et de réassurance pour vos futurs clients.",
            ],
          },
          { type: "image", imageIndex: 1 },
          {
            type: "heading",
            level: 3,
            text: "Couverture vidéo et aftermovie : dynamisez votre communication",
          },
          {
            type: "paragraph",
            content: [
              "Au-delà de l’image fixe, la ",
              strong("couverture vidéo"),
              " est aujourd’hui le format roi pour engager votre audience sur le web et les réseaux sociaux. Notre agence capture l’énergie de la salle, la prestance et les messages clés de vos dirigeants ou intervenants invités.",
            ],
          },
          {
            type: "paragraph",
            content: [
              "Nous produisons un ",
              strong("aftermovie"),
              " dynamique, rythmé et percutant, idéal pour vos campagnes de communication ou pour susciter l’intérêt lors des prochaines éditions de votre congrès. Cette prestation hybride centralise vos besoins médias auprès d’un seul partenaire de confiance.",
            ],
          },
          { type: "videos", videoIndexes: [0, 1] },
          {
            type: "heading",
            level: 2,
            text: "Expertise et connaissance des lieux B2B : choisir votre photographe d’événement à Fès",
          },
          {
            type: "paragraph",
            content: [
              "La ville de Fès offre un cadre architectural et historique exceptionnel pour l’organisation de rencontres professionnelles de haut niveau. Toutefois, les contraintes logistiques et techniques varient énormément d’un espace à l’autre. C’est ici que l’ancrage local de notre équipe de photographes événementiels à Fès fait toute la différence.",
            ],
          },
          {
            type: "heading",
            level: 3,
            text: "Une adaptation parfaite aux espaces de congrès et aux riads",
          },
          {
            type: "paragraph",
            content: [
              "Que vous organisiez un ",
              strong("séminaire d’entreprise"),
              " moderne dans les grands hôtels de conférence de Fès ou un dîner de gala prestigieux dans l’un des somptueux riads privatisés de la médina, nous maîtrisons les défis d’éclairage. La lumière tamisée et complexe des patios historiques ou l’éclairage artificiel intense des espaces de congrès nécessitent un savoir-faire spécifique.",
            ],
          },
          {
            type: "paragraph",
            content: [
              "Votre photographe à Fès anticipe scrupuleusement ces défis logistiques avant même le jour J. Nous effectuons des repérages pour garantir un rendu visuel homogène, net et très haut de gamme, quelle que soit la complexité de l’environnement B2B choisi.",
            ],
          },
          { type: "image", imageIndex: 2 },
        ],
        faqIntroduction:
          "Pour faciliter l’organisation et la planification de votre projet corporate, voici des réponses claires et directes aux questions les plus fréquentes des agences de communication et des décisionnaires.",
        faqs: [
          {
            question: "Quels sont vos délais de livraison ?",
            answer: [
              "Nous garantissons une ",
              strong("livraison rapide"),
              " sous 48 à 72 heures pour l’ensemble des reportages photo complets. Pour les besoins de communication immédiate — réseaux sociaux ou relations presse — nous fournissons une sélection de clichés stratégiques retouchés le jour même de l’événement. Les livrables vidéo, dont les aftermovies, sont livrés sous 7 jours ouvrés.",
            ],
          },
          {
            question:
              "Quel type de matériel utilise votre agence audiovisuelle ?",
            answer: [
              "Nous déployons exclusivement du matériel professionnel plein format de dernière génération. Nous utilisons des objectifs ultra-lumineux adaptés aux environnements sombres des conférences, ainsi que des stabilisateurs motorisés pour des vidéos cinématographiques fluides. Nous apportons également notre propre matériel d’éclairage professionnel si la salle le nécessite.",
            ],
          },
          {
            question:
              "Assurez-vous une couverture sur plusieurs jours pour un séminaire d’entreprise ?",
            answer: [
              "Oui, notre équipe de photographes à Fès est dimensionnée pour couvrir des conventions, salons ou séminaires sur plusieurs jours consécutifs. Nous proposons des forfaits sur mesure incluant la présence continue d’un ",
              strong("photographe corporate"),
              " et d’un vidéaste dédiés, de la plénière d’ouverture jusqu’à la soirée de clôture.",
            ],
          },
        ],
        contactTitle: "Sécurisez la couverture de votre prochain événement",
        contactParagraphs: [
          [
            "Ne laissez pas la communication visuelle de votre événement d’entreprise au hasard. Investissez dans des médias qui reflètent l’excellence, le dynamisme et le sérieux de votre organisation. En collaborant avec nos équipes, vous faites le choix de la réactivité, de la discrétion et d’un retour sur investissement optimisé.",
          ],
          [
            strong(
              "Prêt à valoriser votre événement auprès de votre réseau ? ",
            ),
            "Contactez Photographe Fès dès aujourd’hui pour nous transmettre votre cahier des charges, demander un devis personnalisé ou consulter notre portfolio événementiel B2B.",
          ],
        ],
        contactAction: "Présenter votre événement et demander un devis",
      },
      en: {
        title: "Relive your event through photography and film",
        summary:
          "Our audiovisual agency provides hybrid photography and film coverage for professional events in Fez, from corporate seminars and conferences to gala evenings.",
        metaTitle: "Event photographer in Fez",
        metaDescription:
          "Photography and film coverage for professional events in Fez, including corporate reporting, aftermovies, B2B venues, delivery times, and frequently asked questions.",
        body: [
          {
            type: "heading",
            level: 2,
            text: "The strategic value of an event photographer in Fez for your brand",
          },
          {
            type: "paragraph",
            content: [
              "Organising a professional event is a major investment of time and budget for any company. Creating impactful visual content is essential if that important moment is to continue delivering value. Working with an ",
              strong("event photographer in Fez"),
              " helps preserve the investment and reinforce your brand image over time with employees and clients.",
            ],
          },
          {
            type: "paragraph",
            content: [
              "We understand the demands of B2B communication and the need for faultless visual material. As an experienced photographer in Fez, our role is to capture the character of your event, its conversations, and its atmosphere without disrupting the programme.",
            ],
          },
          {
            type: "heading",
            level: 3,
            text: "Corporate photo reporting focused on return on investment",
          },
          {
            type: "paragraph",
            content: [
              "Institutional and event photography cannot be improvised. Our targeted approach to corporate ",
              strong("photo reporting"),
              " anticipates and isolates the key moments: strategic handshakes, compelling contributions from speakers, and the audience’s level of engagement.",
            ],
          },
          {
            type: "paragraph",
            content: [
              "Every frame is considered for reuse in annual reports, press materials, or LinkedIn posts. A skilled event photographer in Fez understands that these photographs can become practical tools for conversion, prospecting, and reassurance among future clients.",
            ],
          },
          { type: "image", imageIndex: 1 },
          {
            type: "heading",
            level: 3,
            text: "Film coverage and aftermovies: energise your communication",
          },
          {
            type: "paragraph",
            content: [
              "Beyond still images, ",
              strong("film coverage"),
              " is now a leading format for engaging an audience on the web and social platforms. Our agency records the energy in the room, the presence of your leaders or invited speakers, and their key messages.",
            ],
          },
          {
            type: "paragraph",
            content: [
              "We create a dynamic, tightly edited ",
              strong("aftermovie"),
              " for communication campaigns or to build interest in the next edition of your conference. This hybrid service brings your media needs together with one trusted partner.",
            ],
          },
          { type: "videos", videoIndexes: [0, 1] },
          {
            type: "heading",
            level: 2,
            text: "B2B location knowledge: choosing your event photographer in Fez",
          },
          {
            type: "paragraph",
            content: [
              "Fez provides an exceptional architectural and historic setting for high-level professional meetings. Yet the logistical and technical constraints vary widely from one space to another. That is where the local grounding of our Fez event photography team makes a real difference.",
            ],
          },
          {
            type: "heading",
            level: 3,
            text: "Adapting to conference venues and riads",
          },
          {
            type: "paragraph",
            content: [
              "Whether you are arranging a modern ",
              strong("corporate seminar"),
              " in one of Fez’s large conference hotels or a prestigious gala dinner in a privately hired medina riad, we know how to handle the lighting. The low, complex light of a historic courtyard and the intense artificial light of a conference space each require specific expertise.",
            ],
          },
          {
            type: "paragraph",
            content: [
              "Your photographer in Fez anticipates these logistical challenges before the event begins. We scout locations to ensure a consistent, sharp, high-end visual result, whatever the complexity of the chosen B2B environment.",
            ],
          },
          { type: "image", imageIndex: 2 },
        ],
        faqIntroduction:
          "To make a corporate project easier to organise and schedule, here are clear answers to the questions most frequently asked by communication agencies and decision-makers.",
        faqs: [
          {
            question: "What are your delivery times?",
            answer: [
              "We guarantee ",
              strong("fast delivery"),
              " within 48 to 72 hours for complete photo reports. For immediate communication needs — including social media and public relations — we provide a strategic selection of edited photographs on the day of the event. Film deliverables, including aftermovies, are supplied within seven working days.",
            ],
          },
          {
            question: "What equipment does your audiovisual agency use?",
            answer: [
              "We work exclusively with current professional full-frame equipment. Our fast lenses are suited to dark conference environments, while motorised stabilisers produce smooth cinematic footage. We also bring professional lighting when the venue requires it.",
            ],
          },
          {
            question: "Can you cover a multi-day corporate seminar?",
            answer: [
              "Yes. Our Fez photography team is equipped to cover conventions, trade fairs, and seminars over several consecutive days. Tailored packages can include the continuous presence of a dedicated ",
              strong("corporate photographer"),
              " and filmmaker from the opening plenary session through to the closing evening.",
            ],
          },
        ],
        contactTitle: "Secure coverage for your next event",
        contactParagraphs: [
          [
            "Do not leave the visual communication of your corporate event to chance. Invest in media that reflects the excellence, energy, and professionalism of your organisation. Working with our team means choosing responsiveness, discretion, and a stronger return on investment.",
          ],
          [
            strong("Ready to showcase your event to your network? "),
            "Contact Photographer Fez today to share your brief, request a tailored quotation, or view our B2B event portfolio.",
          ],
        ],
        contactAction: "Describe your event and request a quotation",
      },
      ar: {
        title: "استعد أجواء فعاليتك بالصور والفيديو",
        summary:
          "تقدم وكالتنا السمعية البصرية تغطية تجمع بين التصوير الفوتوغرافي والفيديو للفعاليات المهنية في فاس، من ندوات الشركات والمؤتمرات إلى حفلات العشاء الرسمية.",
        metaTitle: "مصور فوتوغرافي للفعاليات في فاس",
        metaDescription:
          "تغطية فوتوغرافية وبالفيديو للفعاليات المهنية في فاس، تشمل التقارير المؤسسية والأفلام الملخصة وأماكن الأعمال ومواعيد التسليم والأسئلة الشائعة.",
        body: [
          {
            type: "heading",
            level: 2,
            text: "القيمة الاستراتيجية لمصور فعاليات في فاس بالنسبة إلى علامتك التجارية",
          },
          {
            type: "paragraph",
            content: [
              "يمثل تنظيم فعالية مهنية استثمارًا كبيرًا في الوقت والميزانية لأي شركة. وللاستفادة المستمرة من هذه المحطة المهمة، لا بد من إنشاء محتوى بصري مؤثر. ويتيح لك التعاون مع ",
              strong("مصور فعاليات في فاس"),
              " الحفاظ على قيمة هذا الاستثمار وتعزيز صورة علامتك التجارية على المدى الطويل لدى الموظفين والعملاء.",
            ],
          },
          {
            type: "paragraph",
            content: [
              "ندرك جيدًا متطلبات التواصل بين الشركات والحاجة إلى مواد بصرية متقنة. وبفضل خبرتنا في التصوير في فاس، تتمثل مهمتنا في التقاط جوهر فعاليتك ولحظات الحوار وأجوائها من دون إرباك سير البرنامج.",
            ],
          },
          {
            type: "heading",
            level: 3,
            text: "تقرير فوتوغرافي للشركات يركز على العائد من الاستثمار",
          },
          {
            type: "paragraph",
            content: [
              "لا يُترك التصوير المؤسساتي وتصوير الفعاليات للارتجال. تقوم منهجيتنا الدقيقة في ",
              strong("التقرير الفوتوغرافي"),
              " للشركات على توقع اللحظات الرئيسية وعزلها: المصافحات الاستراتيجية، ومداخلات المتحدثين المؤثرة، ومستوى تفاعل الجمهور.",
            ],
          },
          {
            type: "paragraph",
            content: [
              "تُخطط كل صورة بعناية لإعادة استخدامها في التقارير السنوية أو الملفات الصحفية أو منشورات LinkedIn. ويدرك مصور الفعاليات المتمرس في فاس أن هذه الصور أدوات عملية لجذب العملاء المحتملين وبناء الثقة لديهم.",
            ],
          },
          { type: "image", imageIndex: 1 },
          {
            type: "heading",
            level: 3,
            text: "تغطية الفيديو والفيلم الملخص: امنح تواصلك مزيدًا من الحيوية",
          },
          {
            type: "paragraph",
            content: [
              "إلى جانب الصور الثابتة، أصبحت ",
              strong("تغطية الفيديو"),
              " من أبرز الصيغ لجذب الجمهور على الويب وشبكات التواصل الاجتماعي. تسجل وكالتنا طاقة القاعة وحضور مسؤوليكم أو المتحدثين المدعوين ورسائلهم الرئيسية.",
            ],
          },
          {
            type: "paragraph",
            content: [
              "ننتج ",
              strong("فيلمًا ملخصًا للفعالية"),
              " يتميز بالحيوية والإيقاع والتأثير، وهو مناسب لحملات التواصل أو لإثارة الاهتمام بالدورة المقبلة من مؤتمركم. وتجمع هذه الخدمة المختلطة احتياجاتكم الإعلامية لدى شريك واحد موثوق.",
            ],
          },
          { type: "videos", videoIndexes: [0, 1] },
          {
            type: "heading",
            level: 2,
            text: "معرفة أماكن الأعمال: اختيار مصور فعاليتك في فاس",
          },
          {
            type: "paragraph",
            content: [
              "توفر مدينة فاس إطارًا معماريًا وتاريخيًا استثنائيًا لتنظيم لقاءات مهنية رفيعة المستوى. غير أن القيود التنظيمية والتقنية تختلف كثيرًا من فضاء إلى آخر. وهنا تصنع المعرفة المحلية لفريق تصوير الفعاليات في فاس فرقًا حقيقيًا.",
            ],
          },
          {
            type: "heading",
            level: 3,
            text: "التكيف مع فضاءات المؤتمرات والرياضات",
          },
          {
            type: "paragraph",
            content: [
              "سواء كنت تنظم ",
              strong("ندوة للشركة"),
              " في أحد فنادق المؤتمرات الكبرى في فاس، أو حفل عشاء رسميًا في رياض فاخر مخصص للمناسبة داخل المدينة العتيقة، فإننا نعرف كيف نتعامل مع تحديات الإضاءة. فالضوء الخافت والمعقد في الأفنية التاريخية والإضاءة الاصطناعية القوية في فضاءات المؤتمرات يتطلبان خبرة خاصة.",
            ],
          },
          {
            type: "paragraph",
            content: [
              "يتوقع مصورك في فاس هذه التحديات التنظيمية بدقة قبل يوم الفعالية. ونعاين المواقع لضمان نتيجة بصرية متجانسة وحادة وراقية مهما كانت بيئة الأعمال المختارة معقدة.",
            ],
          },
          { type: "image", imageIndex: 2 },
        ],
        faqIntroduction:
          "لتيسير تنظيم مشروع شركتك وجدولته، إليك إجابات واضحة ومباشرة عن أكثر الأسئلة التي تطرحها وكالات التواصل وصناع القرار.",
        faqs: [
          {
            question: "ما مواعيد التسليم لديكم؟",
            answer: [
              "نضمن ",
              strong("تسليمًا سريعًا"),
              " خلال 48 إلى 72 ساعة للتقارير الفوتوغرافية الكاملة. وللاحتياجات الفورية في التواصل، بما في ذلك شبكات التواصل الاجتماعي والعلاقات الصحفية، نوفر في يوم الفعالية نفسه مجموعة مختارة من الصور الاستراتيجية المعالجة. أما مخرجات الفيديو، بما فيها الأفلام الملخصة للفعالية، فتُسلّم خلال سبعة أيام عمل.",
            ],
          },
          {
            question: "ما نوع المعدات التي تستخدمها وكالتكم السمعية البصرية؟",
            answer: [
              "نعمل حصريًا بمعدات احترافية حديثة ذات مستشعر كامل الإطار. وتناسب عدساتنا عالية الحساسية للضوء بيئات المؤتمرات المعتمة، فيما تتيح المثبتات الآلية لقطات سينمائية سلسة. كما نحضر معدات إضاءة احترافية عندما يتطلب المكان ذلك.",
            ],
          },
          {
            question: "هل تغطون ندوة شركة تمتد على عدة أيام؟",
            answer: [
              "نعم. فريق التصوير لدينا في فاس مجهز لتغطية المؤتمرات والمعارض والندوات على مدى عدة أيام متتالية. ويمكن أن تشمل العروض المخصصة الحضور المستمر لكل من ",
              strong("مصور شركات"),
              " وصانع أفلام مخصصين، من الجلسة العامة الافتتاحية حتى حفل الاختتام.",
            ],
          },
        ],
        contactTitle: "احجز تغطية فعاليتك المقبلة",
        contactParagraphs: [
          [
            "لا تترك التواصل البصري لفعالية شركتك للصدفة. استثمر في محتوى يعكس تميز مؤسستك وحيويتها واحترافيتها. فالتعاون مع فريقنا يعني اختيار سرعة الاستجابة والعمل الهادئ وتعزيز العائد من الاستثمار.",
          ],
          [
            strong("هل أنت مستعد لإبراز فعاليتك أمام شبكة علاقاتك؟ "),
            "تواصل مع مصور فاس اليوم لإرسال دفتر متطلباتك أو طلب عرض سعر مخصص أو الاطلاع على معرض أعمالنا لفعاليات الشركات.",
          ],
        ],
        contactAction: "عرّف بفعاليتك واطلب عرض سعر",
      },
    },
  },
  {
    slug: "photographe-reseaux-sociaux-fes",
    order: 3,
    author: siteConfig.name,
    images: [
      {
        src: "/images/journal/photographe-reseaux-sociaux-fes/facial-treatment.webp",
        width: 2400,
        height: 1602,
        alt: {
          fr: "Soin du visage réalisé dans un institut de beauté",
          en: "A facial treatment in a beauty studio",
          ar: "جلسة عناية بالوجه داخل مركز تجميل",
        },
      },
      {
        src: "/images/journal/photographe-reseaux-sociaux-fes/traditional-moroccan-portrait.webp",
        width: 1600,
        height: 2400,
        alt: {
          fr: "Portrait en tenue marocaine traditionnelle devant une entrée en zellige",
          en: "Portrait in traditional Moroccan clothing before a tiled entrance",
          ar: "صورة شخصية بلباس مغربي تقليدي أمام مدخل مزين بالزليج",
        },
      },
      {
        src: "/images/journal/photographe-reseaux-sociaux-fes/grilled-fish.webp",
        width: 1597,
        height: 2400,
        alt: {
          fr: "Poisson grillé dressé sur une table de restaurant",
          en: "A plated grilled fish dish on a restaurant table",
          ar: "طبق سمك مشوي مقدم على طاولة مطعم",
        },
      },
    ],
    videos: [
      {
        videoId: "CkAa7Lae5LU",
        youtubeUrl: "https://www.youtube.com/shorts/CkAa7Lae5LU",
        aspect: "portrait",
        label: {
          fr: "Format vidéo vertical pour les réseaux sociaux — première vidéo",
          en: "Vertical social media format — first video",
          ar: "فيديو عمودي لشبكات التواصل الاجتماعي — الفيديو الأول",
        },
      },
      {
        videoId: "a4PxHBb83PA",
        youtubeUrl: "https://www.youtube.com/shorts/a4PxHBb83PA",
        aspect: "portrait",
        label: {
          fr: "Format vidéo vertical pour les réseaux sociaux — deuxième vidéo",
          en: "Vertical social media format — second video",
          ar: "فيديو عمودي لشبكات التواصل الاجتماعي — الفيديو الثاني",
        },
      },
    ],
    content: {
      fr: {
        title: "Réussir votre présence sur les réseaux sociaux",
        summary:
          "NOM Films transforme la présence digitale des entreprises grâce à des photographies haute définition et des formats vidéo verticaux conçus pour les plateformes sociales et les campagnes marketing.",
        metaTitle: "Photographe réseaux sociaux à Fès",
        metaDescription:
          "Photographie, formats vidéo verticaux et création de contenu à Fès pour Instagram, TikTok, Facebook, LinkedIn et les campagnes Meta Ads.",
        body: [
          {
            type: "heading",
            level: 2,
            text: "L’enjeu stratégique de l’image pour les entreprises locales",
          },
          {
            type: "paragraph",
            content: [
              "Le dynamisme économique de la ville de Fès connaît une évolution fulgurante. De l’effervescence touristique, historique et patrimoniale de la médina aux quartiers d’affaires modernes de la Ville Nouvelle, le marché local est en pleine mutation. Les riads de luxe, les restaurants gastronomiques et les artisans d’exception doivent impérativement s’adapter aux nouveaux codes de la communication.",
            ],
          },
          {
            type: "paragraph",
            content: [
              "Dans cet environnement hautement concurrentiel, se démarquer visuellement n’est plus une simple option esthétique, c’est une urgence vitale. Les consommateurs locaux et les touristes internationaux prennent leurs décisions d’achat en quelques secondes. Ces choix sont basés presque exclusivement sur la qualité de votre vitrine digitale sur Instagram, Facebook ou TikTok. Une excellente réputation ne suffit plus : il faut désormais savoir faire rêver en ligne.",
            ],
          },
          {
            type: "paragraph",
            content: [
              "En tant que ",
              strong("photographe à Fès"),
              " spécialisé dans la performance du marketing digital, je constate chaque jour l’impact dévastateur d’une communication visuelle négligée. Des photos sombres, génériques ou mal cadrées dévalorisent instantanément votre offre, augmentant ainsi votre ",
              strong("taux de rebond"),
              " et poussant vos prospects qualifiés directement vers la concurrence.",
            ],
          },
          {
            type: "heading",
            level: 2,
            text: "Une agence de production audiovisuelle orientée ROI",
          },
          {
            type: "paragraph",
            content: [
              "Créer de belles images n’est que la première étape ; il faut surtout qu’elles convertissent. Sous la direction de Mohammed Laâchach, notre ",
              strong("agence de production audiovisuelle"),
              " intègre une véritable réflexion stratégique à chaque phase de prise de vue. Nous ne sommes pas de simples exécutants techniques, mais de véritables partenaires de votre croissance digitale.",
            ],
          },
          {
            type: "paragraph",
            content: [
              "Notre expertise approfondie nous permet de gérer l’intégralité de votre flux de travail créatif. De la définition de la direction artistique au repérage, en passant par le tournage optimisé sur le terrain jusqu’au montage final ultra-dynamique, nous livrons un produit clé en main. Vous gagnez un temps précieux pour vous concentrer pleinement sur votre cœur de métier.",
            ],
          },
          {
            type: "heading",
            level: 3,
            text: "Le pouvoir de la photographie pour le personal branding",
          },
          {
            type: "paragraph",
            content: [
              "À l’ère du web social, les clients n’achètent plus seulement un produit froid : ils adhèrent à une histoire et font confiance à des humains. Développer un ",
              strong("personal branding"),
              " fort est le levier marketing le plus puissant pour créer une connexion émotionnelle, authentique et durable avec votre communauté en ligne.",
            ],
          },
          {
            type: "paragraph",
            content: [
              "Mettre en lumière le visage des dirigeants, l’implication de vos équipes ou la précision minutieuse de votre savoir-faire artisanal permet d’humaniser instantanément votre marque. Ces portraits corporate et reportages métiers augmentent considérablement votre ",
              strong("capital sympathie"),
              " et votre ",
              strong("taux de fidélisation"),
              " client.",
            ],
          },
          { type: "image", imageIndex: 1 },
          {
            type: "heading",
            level: 3,
            text: "Formats verticaux et vidéo pour les réseaux sociaux",
          },
          {
            type: "paragraph",
            content: [
              "Aujourd’hui, l’algorithme des géants du web privilégie massivement le format vidéo. Pour capter une audience de plus en plus volatile et exigeante, l’intégration de la ",
              strong("vidéo pour les réseaux sociaux"),
              " dans votre calendrier éditorial est indispensable. C’est la condition sine qua non pour maintenir une ",
              strong("croissance organique"),
              " soutenue.",
            ],
          },
          {
            type: "paragraph",
            content: [
              "Nous concevons des visuels prêts à être publiés, pensés de A à Z pour maximiser la rétention et le temps de visionnage. Voici les livrables concrets que nous produisons pour nos partenaires commerciaux :",
            ],
          },
          {
            type: "list",
            items: [
              [
                "Des ",
                strong("reels Instagram"),
                " et des TikToks au format vertical 9:16, intégrant des accroches visuelles fortes pour arrêter immédiatement le défilement.",
              ],
              [
                "Des vidéos corporate institutionnelles au format horizontal 16:9, idéales pour asseoir votre autorité sur votre page LinkedIn ou votre site internet.",
              ],
              [
                "Des micro-contenus dynamiques, courts et sous-titrés, parfaits pour alimenter vos stories quotidiennes et faire progresser votre ",
                strong("taux d’engagement"),
                ".",
              ],
              [
                "Du ",
                strong("contenu pour Meta Ads"),
                " décliné en plusieurs variations afin de faciliter vos tests A/B publicitaires.",
              ],
            ],
          },
          { type: "videos", videoIndexes: [0, 1] },
          {
            type: "heading",
            level: 2,
            text: "Rentabilisez vos Meta Ads avec la création de contenu digital à Fès",
          },
          {
            type: "paragraph",
            content: [
              "Diffuser des campagnes publicitaires sponsorisées avec des visuels amateurs revient à gaspiller votre budget marketing. L’algorithme de Meta, qui propulse Facebook et Instagram, pénalise sévèrement les annonces peu attrayantes en limitant leur portée et en augmentant artificiellement leurs coûts de diffusion.",
            ],
          },
          {
            type: "paragraph",
            content: [
              "Investir dans la ",
              strong("création de contenu digital à Fès"),
              " en respectant les plus hauts standards professionnels est la clé pour inverser cette tendance coûteuse. Des photographies lumineuses et des vidéos rythmées arrêtent l’œil du prospect au milieu de son flux d’actualité. Elles améliorent drastiquement votre ",
              strong("taux de clic (CTR)"),
              " sur chaque annonce diffusée.",
            ],
          },
          {
            type: "paragraph",
            content: [
              "Faire appel à l’expertise reconnue d’un photographe à Fès garantit des créations publicitaires percutantes. En augmentant la pertinence de vos publicités aux yeux de l’algorithme, vous abaissez mécaniquement votre ",
              strong("coût par acquisition (CPA)"),
              " et maximisez de façon exponentielle le ",
              strong("retour sur investissement publicitaire (ROAS)"),
              ".",
            ],
          },
          { type: "image", imageIndex: 2 },
        ],
        faqIntroduction:
          "Pour vous aider à mieux structurer votre stratégie de contenu et à anticiper vos campagnes de communication, voici des réponses directes aux questions les plus fréquentes des entrepreneurs locaux.",
        faqs: [
          {
            question:
              "Pourquoi faire appel à un photographe professionnel pour ses réseaux sociaux à Fès ?",
            answer: [
              "Faire appel à un professionnel assure des visuels d’une qualité esthétique supérieure qui renforcent instantanément l’autorité et la crédibilité de votre marque. L’expert maîtrise les codes des plateformes, l’éclairage et la colorimétrie, ce qui augmente votre ",
              strong("portée organique"),
              " et démarque radicalement votre établissement dans la médina ou la Ville Nouvelle.",
            ],
          },
          {
            question:
              "Quels formats vidéo produisez-vous pour Instagram et TikTok ?",
            answer: [
              "Nous réalisons des vidéos au format vertical 9:16, spécialement optimisées pour ces algorithmes. Cela inclut des vidéos de présentation dynamiques, des démonstrations immersives de produits, des interviews face caméra sous-titrées et des teasers percutants conçus pour retenir l’attention dès les trois premières secondes de visionnage.",
            ],
          },
          {
            question:
              "Comment des photos professionnelles peuvent-elles baisser le coût de mes publicités Meta Ads ?",
            answer: [
              "Les visuels esthétiques et professionnels suscitent plus d’intérêt et génèrent un ",
              strong("taux de clic (CTR)"),
              " nettement supérieur auprès de l’audience ciblée. L’algorithme de Meta évalue positivement cet engagement accru et récompense votre annonce en diminuant votre ",
              strong("coût par clic (CPC)"),
              ", ce qui rentabilise directement vos campagnes publicitaires.",
            ],
          },
        ],
        contactTitle: "Passez à l’action et convertissez votre audience",
        contactParagraphs: [
          [
            "Votre présence en ligne est la seule vitrine qui reste ouverte 24 heures sur 24 et 7 jours sur 7. Ne laissez plus des images génériques, floues ou de mauvaise qualité entraver la croissance commerciale de votre entreprise. Sur l’axe Rabat-Marrakech, et tout particulièrement à Fès, l’exigence visuelle des consommateurs n’a jamais été aussi élevée.",
          ],
          [
            "Il est grand temps de professionnaliser votre image de marque et de générer un véritable ",
            strong("retour sur investissement (ROI)"),
            " grâce à vos réseaux sociaux. En tant que photographe à Fès de confiance, j’ai hâte de découvrir les ambitions de votre projet et d’étudier avec vous les meilleures stratégies de captation.",
          ],
          [
            strong("Réservez dès maintenant votre appel stratégique offert "),
            "pour analyser en profondeur vos besoins publicitaires et propulser vos ventes grâce à un contenu audiovisuel haut de gamme.",
          ],
        ],
        contactAction: "Présenter votre stratégie de contenu",
      },
      en: {
        title: "Build a stronger social media presence",
        summary:
          "NOM Films transforms the digital presence of businesses through high-definition photography and vertical video formats designed for social platforms and marketing campaigns.",
        metaTitle: "Social media photographer in Fez",
        metaDescription:
          "Photography, vertical video, and content creation in Fez for Instagram, TikTok, Facebook, LinkedIn, and Meta Ads campaigns.",
        body: [
          {
            type: "heading",
            level: 2,
            text: "Why imagery matters strategically for local businesses",
          },
          {
            type: "paragraph",
            content: [
              "Fez is experiencing rapid economic change. From the historic and cultural tourism of the medina to the modern business districts of the Ville Nouvelle, the local market is evolving. Luxury riads, gastronomic restaurants, and exceptional craftspeople all need to adapt to new forms of communication.",
            ],
          },
          {
            type: "paragraph",
            content: [
              "In this highly competitive environment, standing out visually is no longer simply an aesthetic option; it is an urgent commercial need. Local consumers and international visitors make purchasing decisions within seconds, based almost entirely on the quality of a digital shopfront presented through Instagram, Facebook, or TikTok. A strong reputation is no longer enough: a business must also inspire online.",
            ],
          },
          {
            type: "paragraph",
            content: [
              "As a ",
              strong("photographer in Fez"),
              " specialising in digital marketing performance, I see the damaging effect of neglected visual communication every day. Dark, generic, or poorly framed images immediately devalue an offer, increasing its ",
              strong("bounce rate"),
              " and sending qualified prospects directly to competitors.",
            ],
          },
          {
            type: "heading",
            level: 2,
            text: "An audiovisual production agency focused on ROI",
          },
          {
            type: "paragraph",
            content: [
              "Creating beautiful images is only the first step; they also need to convert. Under Mohammed Laâchach’s direction, our ",
              strong("audiovisual production agency"),
              " brings strategic thinking into every stage of a shoot. We are not simply technical operators, but genuine partners in your digital growth.",
            ],
          },
          {
            type: "paragraph",
            content: [
              "Our experience lets us manage the entire creative workflow. From art direction and location scouting through efficient on-site production to fast-paced final editing, we deliver a complete service. That saves valuable time and lets you concentrate on your core business.",
            ],
          },
          {
            type: "heading",
            level: 3,
            text: "The power of photography for personal branding",
          },
          {
            type: "paragraph",
            content: [
              "In the social web era, clients no longer buy only an impersonal product. They connect with a story and place their trust in people. Building a strong ",
              strong("personal brand"),
              " is a powerful way to create an emotional, authentic, and lasting connection with an online community.",
            ],
          },
          {
            type: "paragraph",
            content: [
              "Showing the people who lead a business, the commitment of its teams, or the precise craft behind its work makes the brand immediately more human. Corporate portraits and workplace reports can significantly strengthen ",
              strong("brand affinity"),
              " and ",
              strong("customer retention"),
              ".",
            ],
          },
          { type: "image", imageIndex: 1 },
          {
            type: "heading",
            level: 3,
            text: "Vertical formats and social media video",
          },
          {
            type: "paragraph",
            content: [
              "Major web platforms now strongly favour video. To reach an audience whose attention is increasingly demanding and short-lived, ",
              strong("social media video"),
              " needs to be part of the editorial calendar. It is essential for maintaining sustained ",
              strong("organic growth"),
              ".",
            ],
          },
          {
            type: "paragraph",
            content: [
              "We create publication-ready visuals designed from beginning to end to improve retention and watch time. Our practical deliverables for commercial partners include:",
            ],
          },
          {
            type: "list",
            items: [
              [
                strong("Instagram Reels"),
                " and TikTok videos in vertical 9:16 format, with strong visual hooks intended to stop the scroll immediately.",
              ],
              [
                "Institutional corporate films in horizontal 16:9 format, ideal for building authority on a LinkedIn page or business website.",
              ],
              [
                "Short, dynamic, subtitled micro-content for daily Stories and stronger ",
                strong("engagement rates"),
                ".",
              ],
              [
                strong("Meta Ads content"),
                " supplied in multiple variations to support advertising A/B tests.",
              ],
            ],
          },
          { type: "videos", videoIndexes: [0, 1] },
          {
            type: "heading",
            level: 2,
            text: "Improve your Meta Ads with digital content creation in Fez",
          },
          {
            type: "paragraph",
            content: [
              "Running sponsored advertising campaigns with amateur visuals simply wastes marketing budget. Meta’s algorithm, which powers Facebook and Instagram, penalises unappealing adverts by limiting their reach and artificially increasing their distribution costs.",
            ],
          },
          {
            type: "paragraph",
            content: [
              "Investing in professional ",
              strong("digital content creation in Fez"),
              " can reverse that costly trend. Bright photographs and well-paced films catch a prospect’s eye in the middle of a feed and can dramatically improve the ",
              strong("click-through rate (CTR)"),
              " of each advert.",
            ],
          },
          {
            type: "paragraph",
            content: [
              "Working with a recognised photographer in Fez delivers more compelling advertising creative. By increasing an advert’s relevance in the eyes of the algorithm, you can reduce the ",
              strong("cost per acquisition (CPA)"),
              " and maximise ",
              strong("return on ad spend (ROAS)"),
              ".",
            ],
          },
          { type: "image", imageIndex: 2 },
        ],
        faqIntroduction:
          "To help structure your content strategy and plan communication campaigns, here are direct answers to the questions most often asked by local entrepreneurs.",
        faqs: [
          {
            question:
              "Why hire a professional photographer for social media in Fez?",
            answer: [
              "A professional provides a higher aesthetic standard that immediately strengthens a brand’s authority and credibility. An expert understands the visual codes of each platform as well as lighting and colour, increasing ",
              strong("organic reach"),
              " and setting a business apart in the medina or Ville Nouvelle.",
            ],
          },
          {
            question:
              "What video formats do you produce for Instagram and TikTok?",
            answer: [
              "We create vertical 9:16 films designed for these platforms and their algorithms. They include dynamic business introductions, immersive product demonstrations, subtitled interviews to camera, and sharp teasers intended to hold attention from the first three seconds.",
            ],
          },
          {
            question:
              "How can professional photography reduce the cost of Meta Ads?",
            answer: [
              "Aesthetic, professional visuals attract more interest and generate a significantly higher ",
              strong("click-through rate (CTR)"),
              " among the target audience. Meta’s algorithm responds positively to that increased engagement and can reward the advert with a lower ",
              strong("cost per click (CPC)"),
              ", improving the campaign’s direct return.",
            ],
          },
        ],
        contactTitle: "Take action and convert your audience",
        contactParagraphs: [
          [
            "Your online presence is the only shopfront that remains open 24 hours a day, seven days a week. Do not let generic, blurred, or poor-quality images hold back your company’s commercial growth. Across the Rabat-Marrakesh corridor, and especially in Fez, consumers’ visual expectations have never been higher.",
          ],
          [
            "It is time to professionalise your brand image and generate a genuine ",
            strong("return on investment (ROI)"),
            " through social media. As a trusted photographer in Fez, I look forward to learning about your ambitions and identifying the best production strategy with you.",
          ],
          [
            strong("Book your complimentary strategy call now "),
            "to explore your advertising needs in detail and support sales with high-end audiovisual content.",
          ],
        ],
        contactAction: "Describe your content strategy",
      },
      ar: {
        title: "عزّز حضورك على شبكات التواصل الاجتماعي",
        summary:
          "تعزز NOM Films الحضور الرقمي للشركات من خلال صور عالية الدقة وفيديوهات عمودية مصممة للمنصات الاجتماعية والحملات التسويقية.",
        metaTitle: "مصور لشبكات التواصل الاجتماعي في فاس",
        metaDescription:
          "تصوير فوتوغرافي وفيديوهات عمودية وإنشاء محتوى في فاس لمنصات Instagram وTikTok وFacebook وLinkedIn وحملات Meta Ads.",
        body: [
          {
            type: "heading",
            level: 2,
            text: "الأهمية الاستراتيجية للصورة بالنسبة إلى الشركات المحلية",
          },
          {
            type: "paragraph",
            content: [
              "تشهد مدينة فاس تغيرًا اقتصاديًا سريعًا. فمن النشاط السياحي والتاريخي والتراثي في المدينة العتيقة إلى أحياء الأعمال الحديثة في المدينة الجديدة، يتطور السوق المحلي باستمرار. ولذلك يتعين على الرياضات الفاخرة والمطاعم الراقية والحرفيين المتميزين التكيف مع أساليب التواصل الجديدة.",
            ],
          },
          {
            type: "paragraph",
            content: [
              "في هذه البيئة شديدة التنافس، لم يعد التميز بصريًا مجرد خيار جمالي، بل أصبح حاجة تجارية ملحة. يتخذ المستهلكون المحليون والزوار الدوليون قرارات الشراء في ثوان، استنادًا في الغالب إلى جودة واجهتك الرقمية على Instagram أو Facebook أو TikTok. فلم تعد السمعة الجيدة كافية، بل بات على الشركة أن تلهم جمهورها عبر الإنترنت أيضًا.",
            ],
          },
          {
            type: "paragraph",
            content: [
              "وبصفتي ",
              strong("مصورًا فوتوغرافيًا في فاس"),
              " متخصصًا في أداء التسويق الرقمي، أرى يوميًا الأثر الضار للتواصل البصري المهمل. فالصور المعتمة أو العامة أو سيئة التأطير تقلل فورًا من قيمة عرضك، وترفع ",
              strong("معدل الارتداد"),
              " وتدفع العملاء المحتملين المؤهلين مباشرة إلى المنافسين.",
            ],
          },
          {
            type: "heading",
            level: 2,
            text: "وكالة إنتاج سمعي بصري تركز على العائد من الاستثمار",
          },
          {
            type: "paragraph",
            content: [
              "إنشاء صور جميلة ليس سوى الخطوة الأولى، إذ ينبغي أيضًا أن تحقق نتائج. وتحت إشراف Mohammed Laâchach، تدمج ",
              strong("وكالة الإنتاج السمعي البصري"),
              " لدينا تفكيرًا استراتيجيًا حقيقيًا في كل مرحلة من مراحل التصوير. فنحن لسنا مجرد منفذين تقنيين، بل شركاء فعليون في نموكم الرقمي.",
            ],
          },
          {
            type: "paragraph",
            content: [
              "تتيح لنا خبرتنا إدارة سير العمل الإبداعي بالكامل. فمن تحديد التوجه الفني ومعاينة المواقع، مرورًا بالتصوير الفعال في الميدان، وصولًا إلى المونتاج النهائي سريع الإيقاع، نقدم خدمة متكاملة. وهكذا توفر وقتًا ثمينًا للتركيز على صميم نشاطك.",
            ],
          },
          {
            type: "heading",
            level: 3,
            text: "قوة التصوير في بناء العلامة الشخصية",
          },
          {
            type: "paragraph",
            content: [
              "في عصر الويب الاجتماعي، لم يعد العملاء يشترون منتجًا مجردًا فحسب، بل يرتبطون بقصة ويضعون ثقتهم في أشخاص. ويعد بناء ",
              strong("علامة شخصية"),
              " قوية وسيلة فعالة لإنشاء صلة عاطفية وصادقة ودائمة مع مجتمعك على الإنترنت.",
            ],
          },
          {
            type: "paragraph",
            content: [
              "إن إظهار وجوه المسؤولين والتزام الفرق ودقة العمل الحرفي يمنح علامتك طابعًا إنسانيًا فورًا. ويمكن للصور الشخصية للشركات والتقارير عن المهن أن تعزز كثيرًا ",
              strong("الألفة مع العلامة"),
              " و",
              strong("الاحتفاظ بالعملاء"),
              ".",
            ],
          },
          { type: "image", imageIndex: 1 },
          {
            type: "heading",
            level: 3,
            text: "الفيديوهات العمودية المخصصة لشبكات التواصل الاجتماعي",
          },
          {
            type: "paragraph",
            content: [
              "تعطي منصات الويب الكبرى اليوم أولوية كبيرة للفيديو. وللوصول إلى جمهور يتسم انتباهه بقصر المدة وتزايد المتطلبات، لا بد من إدراج ",
              strong("فيديوهات شبكات التواصل الاجتماعي"),
              " ضمن جدولك التحريري. فهي ضرورية للحفاظ على ",
              strong("نمو طبيعي"),
              " مستمر.",
            ],
          },
          {
            type: "paragraph",
            content: [
              "نصمم مواد بصرية جاهزة للنشر ومدروسة من البداية إلى النهاية لتحسين الاحتفاظ بالمشاهد ومدة المشاهدة. وتشمل المخرجات العملية التي ننتجها لشركائنا التجاريين ما يلي:",
            ],
          },
          {
            type: "list",
            items: [
              [
                "مقاطع ",
                strong("Reels على Instagram"),
                " وفيديوهات TikTok بالتنسيق العمودي 9:16، مع عناصر بصرية قوية توقف التمرير فورًا.",
              ],
              [
                "أفلام مؤسساتية للشركات بالتنسيق الأفقي 16:9، مثالية لتعزيز مكانتك على صفحة LinkedIn أو موقع الشركة.",
              ],
              [
                "محتوى قصير وديناميكي ومترجم، مناسب للقصص اليومية ولرفع ",
                strong("معدلات التفاعل"),
                ".",
              ],
              [
                strong("محتوى لحملات Meta Ads"),
                " مقدم بعدة نسخ لدعم اختبارات الإعلانات A/B.",
              ],
            ],
          },
          { type: "videos", videoIndexes: [0, 1] },
          {
            type: "heading",
            level: 2,
            text: "حسّن مردودية Meta Ads بإنشاء محتوى رقمي في فاس",
          },
          {
            type: "paragraph",
            content: [
              "إن تشغيل حملات إعلانية ممولة بمواد بصرية غير احترافية يهدر ميزانية التسويق. فخوارزمية Meta التي تشغّل Facebook وInstagram تعاقب الإعلانات غير الجذابة بالحد من وصولها ورفع تكاليف عرضها.",
            ],
          },
          {
            type: "paragraph",
            content: [
              "يمكن للاستثمار في ",
              strong("إنشاء محتوى رقمي احترافي في فاس"),
              " أن يعكس هذا الاتجاه المكلف. فالصور المضيئة والفيديوهات محكمة الإيقاع تجذب انتباه العميل المحتمل وسط موجز الأخبار، ويمكن أن تحسن كثيرًا ",
              strong("معدل النقر إلى الظهور (CTR)"),
              " لكل إعلان.",
            ],
          },
          {
            type: "paragraph",
            content: [
              "يوفر التعاون مع مصور معروف في فاس مواد إعلانية أكثر تأثيرًا. ومن خلال زيادة ملاءمة الإعلان في نظر الخوارزمية، يمكنك خفض ",
              strong("تكلفة اكتساب العميل (CPA)"),
              " وتعظيم ",
              strong("العائد على الإنفاق الإعلاني (ROAS)"),
              ".",
            ],
          },
          { type: "image", imageIndex: 2 },
        ],
        faqIntroduction:
          "لمساعدتك في تنظيم استراتيجية المحتوى والتخطيط لحملات التواصل، إليك إجابات مباشرة عن أكثر الأسئلة التي يطرحها رواد الأعمال المحليون.",
        faqs: [
          {
            question:
              "لماذا تستعين بمصور محترف لشبكات التواصل الاجتماعي في فاس؟",
            answer: [
              "يوفر المصور المحترف مستوى جماليًا أعلى يعزز فورًا مكانة علامتك ومصداقيتها. كما يفهم الخبير الأساليب البصرية لكل منصة إلى جانب الإضاءة والألوان، ما يزيد ",
              strong("الوصول الطبيعي"),
              " ويميز مؤسستك بوضوح في المدينة العتيقة أو المدينة الجديدة.",
            ],
          },
          {
            question: "ما تنسيقات الفيديو التي تنتجونها لـ Instagram وTikTok؟",
            answer: [
              "ننتج فيديوهات عمودية بتنسيق 9:16 ومهيأة لهذه المنصات وخوارزمياتها. وتشمل فيديوهات ديناميكية للتعريف بالنشاط، وعروضًا غامرة للمنتجات، ومقابلات مباشرة أمام الكاميرا مزودة بترجمة، ومقاطع تشويقية مؤثرة مصممة للاحتفاظ بالانتباه منذ الثواني الثلاث الأولى.",
            ],
          },
          {
            question: "كيف يمكن للصور الاحترافية خفض تكلفة إعلانات Meta Ads؟",
            answer: [
              "تجذب المواد البصرية الجميلة والاحترافية اهتمامًا أكبر وتولد ",
              strong("معدل نقر إلى ظهور (CTR)"),
              " أعلى بكثير لدى الجمهور المستهدف. وتقيّم خوارزمية Meta هذا التفاعل المتزايد بصورة إيجابية، وقد تكافئ الإعلان بخفض ",
              strong("تكلفة النقرة (CPC)"),
              "، ما يحسن مردود الحملة مباشرة.",
            ],
          },
        ],
        contactTitle: "اتخذ الخطوة وحوّل جمهورك إلى عملاء",
        contactParagraphs: [
          [
            "حضورك على الإنترنت هو الواجهة الوحيدة التي تظل مفتوحة على مدار الساعة وطوال أيام الأسبوع. فلا تدع الصور العامة أو الضبابية أو الرديئة تعرقل النمو التجاري لشركتك. وعلى محور الرباط ومراكش، ولا سيما في فاس، لم تكن المتطلبات البصرية لدى المستهلكين أعلى مما هي عليه اليوم.",
          ],
          [
            "حان الوقت لإضفاء الاحترافية على صورة علامتك وتحقيق ",
            strong("عائد حقيقي من الاستثمار (ROI)"),
            " عبر شبكات التواصل الاجتماعي. وبصفتي مصورًا موثوقًا في فاس، أتطلع إلى التعرف على طموحات مشروعك وتحديد أفضل استراتيجية للإنتاج معك.",
          ],
          [
            strong("احجز الآن مكالمتك الاستراتيجية المجانية "),
            "لبحث احتياجاتك الإعلانية بالتفصيل ودعم المبيعات بمحتوى سمعي بصري راقٍ.",
          ],
        ],
        contactAction: "عرّف باستراتيجية المحتوى الخاصة بك",
      },
    },
  },
] as const satisfies ReadonlyArray<JournalArticle>;

export type JournalSlug = (typeof journalArticles)[number]["slug"];

export const journalSlugs = journalArticles.map((article) => article.slug);

export function getJournalArticle(slug: string) {
  return journalArticles.find((article) => article.slug === slug);
}
