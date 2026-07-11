import { createClient } from "./client.ts";
import { subjects, clues } from "./schema.ts";

const dbUrl = process.env.DATABASE_URL ?? "postgres://localhost:5432/indyer";
const db = createClient(dbUrl);

const roster = [
  {
    name: "Chinua Achebe",
    acceptedAnswers: ["achebe", "chinua achebe", "albert chinụalụmọgụ achebe"],
    category: "writer",
    era: "20th century",
    clues: [
      { axis: "origin", text: "I was born in Ogidi, a town in Eastern Nigeria, in 1930.", order: 1 },
      { axis: "work", text: "My first novel was published in 1958 and has sold over 20 million copies worldwide.", order: 2 },
      { axis: "place", text: "I was a professor at the University of Nigeria, Nsukka, where the library now bears my name.", order: 3 },
      { axis: "contemporary", text: "I was a friend and contemporary of Wole Soyinka, though we often disagreed.", order: 4 },
      { axis: "epithet", text: "I am widely called the Father of African Literature.", order: 5 },
      { axis: "end", text: "I died in Boston in 2013 at the age of 82, but my spirit remains in my books.", order: 6 },
    ],
  },
  {
    name: "Fela Kuti",
    acceptedAnswers: ["fela", "fela kuti", "fela anikulapo kuti", "féla"],
    category: "musician",
    era: "20th century",
    clues: [
      { axis: "origin", text: "I was born in Abeokuta in 1938 into a family of activists.", order: 1 },
      { axis: "work", text: "I invented a genre of music that blends jazz, funk, and traditional Yoruba rhythms.", order: 2 },
      { axis: "place", text: "My nightclub in Lagos was called the Shrine, and it was the heart of my movement.", order: 3 },
      { axis: "contemporary", text: "My mother was a prominent activist whose portrait now adorns the 20 naira note.", order: 4 },
      { axis: "epithet", text: "I am remembered by the name I gave myself: Abami Eda, the Strange One.", order: 5 },
      { axis: "end", text: "I died in 1997 from complications of AIDS, but my music lives on as a global protest anthem.", order: 6 },
    ],
  },
  {
    name: "Ngozi Okonjo-Iweala",
    acceptedAnswers: ["okonjo-iweala", "ngozi okonjo-iweala", "dr ngozi"],
    category: "leader",
    era: "contemporary",
    clues: [
      { axis: "origin", text: "I was born in 1954 in Ogwashi-Ukwu, Delta State.", order: 1 },
      { axis: "work", text: "I am the first woman and first African to lead the World Trade Organization.", order: 2 },
      { axis: "place", text: "I served twice as Nigeria's Finance Minister in Abuja.", order: 3 },
      { axis: "contemporary", text: "I am a fellow Nigerian with Chimamanda Adichie, and we have appeared together on global stages.", order: 4 },
      { axis: "epithet", text: "Forbes named me one of the 100 Most Powerful Women in the World.", order: 5 },
      { axis: "end", text: "I am still serving as WTO Director-General, shaping global trade policy.", order: 6 },
    ],
  },
  {
    name: "Kanu Nwankwo",
    acceptedAnswers: ["kanu", "nwankwo kanu", "kanu nwankwo", "papilo"],
    category: "footballer",
    era: "contemporary",
    clues: [
      { axis: "origin", text: "I was born in Owerri, Imo State, in 1976.", order: 1 },
      { axis: "work", text: "I won the UEFA Champions League with Ajax Amsterdam at age 19.", order: 2 },
      { axis: "place", text: "I played for Arsenal's Invincibles, the team that went an entire Premier League season unbeaten.", order: 3 },
      { axis: "contemporary", text: "I captained the Nigerian national team alongside Jay-Jay Okocha.", order: 4 },
      { axis: "epithet", text: "Fans call me Papilo — a nickname that means Daddy in my native dialect.", order: 5 },
      { axis: "end", text: "I now run the Kanu Heart Foundation, saving children with heart defects.", order: 6 },
    ],
  },
  {
    name: "Chimamanda Ngozi Adichie",
    acceptedAnswers: ["adichie", "chimamanda", "chimamanda adichie", "chimamanda ngozi adichie"],
    category: "writer",
    era: "contemporary",
    clues: [
      { axis: "origin", text: "I was born in Enugu in 1977 and grew up in Nsukka.", order: 1 },
      { axis: "work", text: "My novel Half of a Yellow Sun won the Orange Prize for Fiction in 2007.", order: 2 },
      { axis: "place", text: "I divide my time between Nigeria and the United States, where I teach writing workshops.", order: 3 },
      { axis: "contemporary", text: "Beyoncé sampled my words on her album, introducing me to millions of new readers.", order: 4 },
      { axis: "epithet", text: "I am often called one of the most influential African writers of my generation.", order: 5 },
      { axis: "end", text: "I continue to write novels, essays, and speeches that shape global conversations on race and feminism.", order: 6 },
    ],
  },
  {
    name: "Wole Soyinka",
    acceptedAnswers: ["soyinka", "wole soyinka", "aka wole soyinka"],
    category: "writer",
    era: "20th century",
    clues: [
      { axis: "origin", text: "I was born in Abeokuta in 1934, the same town Fela Kuti called home.", order: 1 },
      { axis: "work", text: "I wrote The Lion and the Jewel and Season of Anomy — plays performed worldwide.", order: 2 },
      { axis: "place", text: "I was a professor at the University of Ibadan and later taught at Harvard and Oxford.", order: 3 },
      { axis: "contemporary", text: "I was imprisoned during the Nigerian Civil War and wrote my prison notes on toilet paper.", order: 4 },
      { axis: "epithet", text: "I am the first African to win the Nobel Prize in Literature.", order: 5 },
      { axis: "end", text: "At 90, I remain a vocal critic of tyranny and an enduring symbol of African letters.", order: 6 },
    ],
  },
  {
    name: "Burna Boy",
    acceptedAnswers: ["burna boy", "damini ogulu", "burna"],
    category: "musician",
    era: "contemporary",
    clues: [
      { axis: "origin", text: "I was born in Port Harcourt in 1991 to a Nigerian mother and a British father.", order: 1 },
      { axis: "work", text: "My album African Giant was nominated for a Grammy, and I won the Grammy for Best Global Album in 2021.", order: 2 },
      { axis: "place", text: "I own a recording studio in Lagos called Spaceship Collective.", order: 3 },
      { axis: "contemporary", text: "I have collaborated with Beyoncé, Ed Sheeran, and Sir David Attenborough.", order: 4 },
      { axis: "epithet", text: "I call myself the African Giant and Odogwu — a title meaning Big Man in Igbo.", order: 5 },
      { axis: "end", text: "I am still in my prime, touring the world and carrying Afrobeats to every continent.", order: 6 },
    ],
  },
  {
    name: "Nnamdi Azikiwe",
    acceptedAnswers: ["azikiwe", "nnamdi azikiwe", "zík"],
    category: "leader",
    era: "20th century",
    clues: [
      { axis: "origin", text: "I was born in Zungeru, Northern Nigeria, in 1904 to Igbo parents.", order: 1 },
      { axis: "work", text: "I was the first President of Nigeria after independence in 1963.", order: 2 },
      { axis: "place", text: "The University of Nigeria, Nsukka, which I founded, now bears Nnamdi Azikiwe Library.", order: 3 },
      { axis: "contemporary", text: "I led the independence struggle alongside Obafemi Awolowo and Ahmadu Bello.", order: 4 },
      { axis: "epithet", text: "I am known as Zik of Africa, a journalist turned statesman.", order: 5 },
      { axis: "end", text: "I died in Enugu in 1996 at the age of 91, leaving behind a legacy of pan-Africanism.", order: 6 },
    ],
  },
  {
    name: "Jay-Jay Okocha",
    acceptedAnswers: ["okocha", "jay-jay okocha", "augustine okocha", "jj okocha"],
    category: "footballer",
    era: "contemporary",
    clues: [
      { axis: "origin", text: "I was born in Enugu in 1973, the youngest of eight children.", order: 1 },
      { axis: "work", text: "I played for Paris Saint-Germain and Bolton Wanderers, dazzling fans with my skill.", order: 2 },
      { axis: "place", text: "I captained the Super Eagles at the 2004 Africa Cup of Nations in Tunisia.", order: 3 },
      { axis: "contemporary", text: "I was teammates with Kanu Nwankwo in the Nigerian Golden Generation.", order: 4 },
      { axis: "epithet", text: "Fans called me Sojay — coined from my name and the word wizard.", order: 5 },
      { axis: "end", text: "I am now a football ambassador and mentor to young Nigerian players.", order: 6 },
    ],
  },
  {
    name: "Funmilayo Ransome-Kuti",
    acceptedAnswers: ["funmilayo ransome kuti", "funmilayo", "fumilayo", "beyonce's grandmother"],
    category: "leader",
    era: "20th century",
    clues: [
      { axis: "origin", text: "I was born in Abeokuta in 1900, into a family of educators.", order: 1 },
      { axis: "work", text: "I led the Abeokuta Women's Union and fought against colonial taxation of women.", order: 2 },
      { axis: "place", text: "My home in Abeokuta became the headquarters of the Nigerian women's movement.", order: 3 },
      { axis: "contemporary", text: "I was the mother of Fela Kuti and the first woman to drive a car in Nigeria.", order: 4 },
      { axis: "epithet", text: "I am remembered as the Lioness of Lisabi for my fearless activism.", order: 5 },
      { axis: "end", text: "I died in 1978 from injuries sustained during a military raid on my son's compound.", order: 6 },
    ],
  },
];

async function seed() {
  console.log("Seeding database...");

  for (const entry of roster) {
    const [subject] = await db
      .insert(subjects)
      .values({
        name: entry.name,
        acceptedAnswers: entry.acceptedAnswers,
        category: entry.category,
        era: entry.era,
      })
      .returning({ id: subjects.id, name: subjects.name });

    const clueValues = entry.clues.map((c) => ({
      subjectId: subject.id,
      axis: c.axis,
      text: c.text,
      order: c.order,
    }));

    await db.insert(clues).values(clueValues);
    console.log(`  ✓ ${subject.name} — ${subject.id}`);
  }

  console.log("Seeding complete");
  process.exit(0);
}

seed().catch((e) => {
  console.error("Seed failed:", e);
  process.exit(1);
});
