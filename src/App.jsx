import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
} from 'react';
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';
import {
  Play,
  Pause,
  BookOpen,
  Layers,
  Volume2,
  X,
  Check,
  RotateCcw,
  Lock,
  Sparkles,
  BarChart2,
  BookMarked,
  Bell,
  Target,
  Flame,
  CheckCircle2,
  Circle,
  Home as HomeIcon,
  Gamepad2,
  GraduationCap,
  ChevronRight,
  ChevronLeft,
  Shuffle,
  Clock,
} from 'lucide-react';

/* ============================================================
   FONTS
   ============================================================ */
function useFonts() {
  useEffect(() => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href =
      'https://fonts.googleapis.com/css2?family=Shippori+Mincho:wght@500;700&family=Noto+Serif+JP:wght@400;600&family=Source+Serif+4:opsz,wght@8..60,400;8..60,600&display=swap';
    document.head.appendChild(link);
    return () => document.head.removeChild(link);
  }, []);
}

/* ============================================================
   CONTENT — Genesis 1
   ============================================================ */
   const GENESIS_1 = [
    {
      v: 1,
      jp: 'はじめに神は天と地とを創造された。',
      en: 'In the beginning, God created the heavens and the earth.',
    },
    {
      v: 2,
      jp: '地は形なく、むなしく、やみが淵のおもてにあり、神の霊が水のおもてをおおっていた。',
      en: 'The earth was formless and empty. Darkness was over the surface of the deep, and the Spirit of God was hovering over the surface of the waters.',
    },
    {
      v: 3,
      jp: '神は「光あれ」と言われた。すると光があった。',
      en: 'God said, \u201CLet there be light,\u201D and there was light.',
    },
    {
      v: 4,
      jp: '神はその光を見て、良しとされた。神は光とやみとを分けられた。',
      en: 'God saw the light, and it was good. God separated the light from the darkness.',
    },
    {
      v: 5,
      jp: '神は光を昼と名づけ、やみを夜と名づけられた。夕となり、また朝となった。第一日である。',
      en: 'God called the light Day, and the darkness he called Night. There was evening and there was morning \u2014 the first day.',
    },
    {
      v: 6,
      jp: '神はまた言われた、「水の間に大空があって、水と水とを分けよ」。',
      en: 'God said, \u201CLet there be an expanse between the waters, to separate water from water.\u201D',
    },
    {
      v: 7,
      jp: '神は大空を造って、大空の下の水と大空の上の水とを分けられた。そのようになった。',
      en: 'God made the expanse and separated the water under the expanse from the water above it. And it was so.',
    },
    {
      v: 8,
      jp: '神は大空を天と名づけられた。夕となり、また朝となった。第二日である。',
      en: 'God called the expanse Sky. There was evening and there was morning \u2014 the second day.',
    },
    {
      v: 9,
      jp: '神はまた言われた、「天の下の水は一つ所に集まり、かわいた地が現れよ」。そのようになった。',
      en: 'God said, \u201CLet the water under the sky be gathered into one place, and let dry ground appear.\u201D And it was so.',
    },
    {
      v: 10,
      jp: '神はそのかわいた地を陸と名づけ、水の集まった所を海と名づけられた。神は見て、良しとされた。',
      en: 'God called the dry ground Land, and the gathered waters he called Seas. God saw that it was good.',
    },
    {
      v: 11,
      jp: '神はまた言われた、「地は青草と、種をもつ草と、種類にしたがって種のある実を結ぶ果樹とを地に生えさせよ」。そのようになった。',
      en: 'God said, \u201CLet the earth produce green plants, plants bearing seed, and fruit trees bearing fruit with seed in it, each according to its kind.\u201D And it was so.',
      overrides: { 生: 'は' },
    },
    {
      v: 12,
      jp: '地は青草と、種類にしたがって種をもつ草と、種類にしたがって種のある実を結ぶ木とを生じた。神は見て、良しとされた。',
      en: 'The earth produced green plants, plants bearing seed according to their kinds, and trees bearing fruit with seed in it according to their kinds. God saw that it was good.',
    },
    {
      v: 13,
      jp: '夕となり、また朝となった。第三日である。',
      en: 'There was evening and there was morning \u2014 the third day.',
    },
    {
      v: 14,
      jp: '神はまた言われた、「天の大空に光る物があって、昼と夜とを分け、しるしのため、季節のため、日のため、年のためになり、',
      en: 'God said, \u201CLet there be lights in the expanse of the sky to separate day from night. Let them serve as signs, and for seasons, and for days and years,',
    },
    {
      v: 15,
      jp: '天の大空にあって地を照らす光となれ」。そのようになった。',
      en: 'and let them be lights in the expanse of the sky to give light on the earth.\u201D And it was so.',
    },
    {
      v: 16,
      jp: '神は二つの大きな光る物と星とを造り、大きい光る物には昼をつかさどらせ、小さい光る物には夜をつかさどらせた。',
      en: 'God made two great lights \u2014 the greater light to govern the day and the lesser light to govern the night \u2014 and the stars also.',
    },
    {
      v: 17,
      jp: '神はこれらを天の大空に置いて地を照らさせ、',
      en: 'God set them in the expanse of the sky to give light on the earth,',
    },
    {
      v: 18,
      jp: '昼と夜とをつかさどらせ、光とやみとを分けさせられた。神は見て、良しとされた。',
      en: 'to govern the day and the night, and to separate the light from the darkness. God saw that it was good.',
    },
    {
      v: 19,
      jp: '夕となり、また朝となった。第四日である。',
      en: 'There was evening and there was morning \u2014 the fourth day.',
    },
    {
      v: 20,
      jp: '神はまた言われた、「水は生物の群れで満ち、鳥は地の上、天の大空を飛べ」。',
      en: 'God said, \u201CLet the waters teem with living creatures, and let birds fly above the earth, across the expanse of the sky.\u201D',
    },
    {
      v: 21,
      jp: '神は大きな海の獣と、水に群がるすべての動くもの、すなわちその種類にしたがって、また羽のある鳥をその種類にしたがって創造された。神は見て、良しとされた。',
      en: 'God created the great sea creatures, and every living thing that moves, with which the waters teem, according to their kinds, and every winged bird according to its kind. God saw that it was good.',
      overrides: { 群: 'むら' },
    },
    {
      v: 22,
      jp: '神はこれらを祝福して言われた、「生めよ、ふえよ、海の水に満ちよ、また鳥は地にふえよ」。',
      en: 'God blessed them, saying, \u201CBe fruitful and multiply and fill the waters of the seas, and let the birds multiply on the earth.\u201D',
      overrides: { 生: 'う' },
    },
    {
      v: 23,
      jp: '夕となり、また朝となった。第五日である。',
      en: 'There was evening and there was morning \u2014 the fifth day.',
    },
    {
      v: 24,
      jp: '神はまた言われた、「地は生物をその種類にしたがっていだせ、家畜と、這うものと、地の獣とをその種類にしたがっていだせ」。そのようになった。',
      en: 'God said, \u201CLet the earth produce living creatures according to their kinds \u2014 livestock, creeping things, and wild animals, each according to its kind.\u201D And it was so.',
    },
    {
      v: 25,
      jp: '神は地の獣をその種類にしたがい、家畜をその種類にしたがい、また地のすべての這うものをその種類にしたがって造られた。神は見て、良しとされた。',
      en: 'God made the wild animals according to their kinds, the livestock according to their kinds, and everything that creeps on the ground according to its kind. God saw that it was good.',
    },
    {
      v: 26,
      jp: '神はまた言われた、「われわれのかたちに、われわれにかたどって人を造り、これに海の魚と、空の鳥と、家畜と、地のすべての獣と、地のすべての這うものとを治めさせよう」。',
      en: 'God said, \u201CLet us make man in our image, after our likeness, and let them rule over the fish of the sea, the birds of the sky, the livestock, and every creeping thing that creeps on the earth.\u201D',
    },
    {
      v: 27,
      jp: '神は自分のかたちに人を創造された。すなわち、神のかたちに創造し、男と女とに創造された。',
      en: 'God created man in his own image; in the image of God he created him; male and female he created them.',
    },
    {
      v: 28,
      jp: '神は彼らを祝福して言われた、「生めよ、ふえよ、地に満ちよ、地を従わせよ。また海の魚と、空の鳥と、地に動くすべての生物とを治めよ」。',
      en: 'God blessed them and said to them, \u201CBe fruitful, multiply, fill the earth, and subdue it. Rule over the fish of the sea, the birds of the sky, and every living thing that moves on the earth.\u201D',
      overrides: { 生: 'う' },
    },
    {
      v: 29,
      jp: '神はまた言われた、「見よ、わたしは全地のおもてにある種をもつすべての草と、種のある実を結ぶすべての木とをあなたがたに与える。それはあなたがたの食物となるであろう。',
      en: 'God said, \u201CLook, I have given you every plant bearing seed on the face of the whole earth, and every tree with fruit bearing seed. They will be food for you.',
    },
    {
      v: 30,
      jp: 'また地のすべての獣、空のすべての鳥、地を這うすべてのもの、すなわち命あるものには、食物としてすべての青草を与える」。そのようになった。',
      en: 'And to every animal of the earth, every bird of the sky, and everything that creeps on the ground \u2014 everything that has the breath of life \u2014 I give every green plant for food.\u201D And it was so.',
    },
    {
      v: 31,
      jp: '神が造ったすべての物を見られたところ、それは、はなはだ良かった。夕となり、また朝となった。第六日である。',
      en: 'God saw everything he had made, and it was very good. There was evening and there was morning \u2014 the sixth day.',
    },
  ];
  const GENESIS_2 = [
    {
      v: 1,
      jp: 'こうして天と地と、その万象とが完成した。',
      en: 'Thus the heavens and the earth were completed in all their vast array.',
    },
    {
      v: 2,
      jp: '神は第七日に、その作業を終えられた。すなわち、そのすべての作業を終って、第七日に休まれた。',
      en: 'By the seventh day God had finished the work He had been doing; so on the seventh day He rested from all His work.',
    },
    {
      v: 3,
      jp: '神は第七日を祝福して、これを聖別された。神がこの日に、そのすべての創造のわざを終って休まれたからである。',
      en: 'Then God blessed the seventh day and made it holy, because on it He rested from all the work of creation that He had accomplished.',
    },
    {
      v: 4,
      jp: 'これは天地創造の由来である。主なる神が地と天とを造られた時、',
      en: 'This is the account of the heavens and the earth when they were created, in the day that the LORD God made the earth and the heavens.',
    },
    {
      v: 5,
      jp: '地にはまだ野の木もなく、野の草もまだはえていなかった。主なる神が地に雨を降らせず、また土を耕す人もなかったからである。',
      en: 'Now no shrub of the field had yet appeared on the earth, and no plant of the field had yet sprung up, for the LORD God had not sent rain upon the earth, and there was no man to cultivate the ground.',
    },
    {
      v: 6,
      jp: 'しかし、水が地からわきあがって、土の全面を潤していた。',
      en: 'But a mist would rise from the earth and water the whole surface of the ground.',
    },
    {
      v: 7,
      jp: '主なる神は土のちりで人を造り、命の息をその鼻に吹きいれられた。そこで人は生きた者となった。',
      en: 'Then the LORD God formed a man from the dust of the ground and breathed into his nostrils the breath of life, and the man became a living being.',
    },
    {
      v: 8,
      jp: '主なる神は東のかたエデンに園を造り、そこにご自分で造った人を置かれた。',
      en: 'And the LORD God planted a garden in Eden, in the east, and there He put the man He had formed.',
    },
    {
      v: 9,
      jp: 'また主なる神は、見て美しく、食べるに良いすべての木を土からはえさせ、園の中央には命の木と善悪を知る木とをはえさせられた。',
      en: 'And the LORD God made all kinds of trees grow out of the ground—trees that were pleasing to the eye and good for food. In the middle of the garden were the tree of life and the tree of the knowledge of good and evil.',
    },
    {
      v: 10,
      jp: 'ひとつの川がエデンから流れ出て園を潤し、そこから分れて四つの川となった。',
      en: 'A river flowed from Eden to water the garden, and from there it branched into four headwaters.',
    },
    {
      v: 11,
      jp: 'その第一の名はピションといい、金のあるハビラの全地をめぐる。',
      en: 'The name of the first is Pishon; it winds through the entire land of Havilah, where there is gold.',
    },
    {
      v: 12,
      jp: 'その地の金は良質で、またそこにはブドラクとしまめのうとがある。',
      en: 'The gold of that land is pure; bdellium and onyx are also there.',
    },
    {
      v: 13,
      jp: '第二の川の名はギホンといい、クシュの全地をめぐる。',
      en: 'The name of the second river is Gihon; it winds through the entire land of Cush.',
    },
    {
      v: 14,
      jp: '第三の川の名はヒデケルといい、アッスルの東を流れる。第四の川はユーフラテスである。',
      en: 'The name of the third river is Tigris; it runs along the east side of Asshur. And the fourth river is the Euphrates.',
    },
    {
      v: 15,
      jp: '主なる神は人を連れて行ってエデンに置き、これを耕させ、これを守らせた。',
      en: 'The LORD God took the man and placed him in the Garden of Eden to work it and watch over it.',
    },
    {
      v: 16,
      jp: '主なる神はその人に命じて言われた、「あなたは園のどの木からでも思いのままに取って食べなさい。',
      en: 'And the LORD God commanded the man, "You are free to eat from any tree of the garden,',
    },
    {
      v: 17,
      jp: 'しかし善悪を知る木からは取って食べてはならない。それを取って食べると、きっと死ぬであろう」。',
      en: 'but you must not eat from the tree of the knowledge of good and evil; for in the day that you eat of it, you will surely die." ',
    },
    {
      v: 18,
      jp: '主なる神は言われた、「人がひとりでいるのは良くない。彼のために、ふさわしい助け手を造ろう」。',
      en: 'Then the LORD God said, "It is not good for the man to be alone. I will make a helper suitable for him." ',
    },
    {
      v: 19,
      jp: '主なる神は野のあらゆる獣と、空のあらゆる鳥とを土で造り、人に導いて、彼がそれにどんな名を付けるかを見られた。人がすべて生き物に与える名は、その名となるのであった。',
      en: 'So the LORD God formed out of the ground every beast of the field and every bird of the air, and brought them to the man to see what he would call them. And whatever the man called each living creature, that was its name.',
    },
    {
      v: 20,
      jp: 'それで人はすべての家畜、空の鳥、野のあらゆる獣に名をつけたが、人にはふさわしい助け手が見つからなかった。',
      en: 'So the man gave names to all the livestock, the birds of the air, and every beast of the field. But for Adam, no suitable helper was found.',
    },
    {
      v: 21,
      jp: 'そこで主なる神は人を深く眠らせ、眠った時に、そのあばら骨の一つをとり、その所を肉でふさがれた。',
      en: 'So the LORD God caused the man to fall into a deep sleep, and while he was sleeping, He took one of the man’s ribs and closed up the place with flesh.',
    },
    {
      v: 22,
      jp: '主なる神は人から取ったあばら骨でひとりの女を造り、人のところに導いてこられた。',
      en: 'Then the LORD God made a woman from the rib He had taken out of the man, and He brought her to the man.',
    },
    {
      v: 23,
      jp: '人は言った、「これこそ、わたしの骨の骨、わたしの肉の肉。男から取ったものだから、女と名づけよう」。',
      en: 'And the man said, "This is now bone of my bones and flesh of my flesh; she shall be called ‘woman,’ for she was taken out of man." ',
    },
    {
      v: 24,
      jp: 'それゆえ男はその父母を離れて女と結び合い、一体となるのである。',
      en: 'For this reason a man will leave his father and mother and be united to his wife, and they will become one flesh.',
    },
    {
      v: 25,
      jp: '人とその妻とは、ふたりとも裸であったが、恥ずかしがらなかった。',
      en: 'And the man and his wife were both naked, yet they felt no shame.',
    },
  ];
  const CHAPTER_DATA = {
    1: GENESIS_1,
    2: GENESIS_2,
    // We'll add Genesis 3 here once you have it
  };

/* ============================================================
   KANA -> ROMAJI ENGINE
   ============================================================ */
const KANA = {
  あ: 'a',
  い: 'i',
  う: 'u',
  え: 'e',
  お: 'o',
  か: 'ka',
  き: 'ki',
  く: 'ku',
  け: 'ke',
  こ: 'ko',
  が: 'ga',
  ぎ: 'gi',
  ぐ: 'gu',
  げ: 'ge',
  ご: 'go',
  さ: 'sa',
  し: 'shi',
  す: 'su',
  せ: 'se',
  そ: 'so',
  ざ: 'za',
  じ: 'ji',
  ず: 'zu',
  ぜ: 'ze',
  ぞ: 'zo',
  た: 'ta',
  ち: 'chi',
  つ: 'tsu',
  て: 'te',
  と: 'to',
  だ: 'da',
  ぢ: 'ji',
  づ: 'zu',
  で: 'de',
  ど: 'do',
  な: 'na',
  に: 'ni',
  ぬ: 'nu',
  ね: 'ne',
  の: 'no',
  は: 'ha',
  ひ: 'hi',
  ふ: 'fu',
  へ: 'he',
  ほ: 'ho',
  ば: 'ba',
  び: 'bi',
  ぶ: 'bu',
  べ: 'be',
  ぼ: 'bo',
  ぱ: 'pa',
  ぴ: 'pi',
  ぷ: 'pu',
  ぺ: 'pe',
  ぽ: 'po',
  ま: 'ma',
  み: 'mi',
  む: 'mu',
  め: 'me',
  も: 'mo',
  や: 'ya',
  ゆ: 'yu',
  よ: 'yo',
  ら: 'ra',
  り: 'ri',
  る: 'ru',
  れ: 're',
  ろ: 'ro',
  わ: 'wa',
  を: 'o',
  ん: 'n',
  ぎゃ: 'gya',
  ぎゅ: 'gyu',
  ぎょ: 'gyo',
  きゃ: 'kya',
  きゅ: 'kyu',
  きょ: 'kyo',
  しゃ: 'sha',
  しゅ: 'shu',
  しょ: 'sho',
  じゃ: 'ja',
  じゅ: 'ju',
  じょ: 'jo',
  ちゃ: 'cha',
  ちゅ: 'chu',
  ちょ: 'cho',
  にゃ: 'nya',
  にゅ: 'nyu',
  にょ: 'nyo',
  ひゃ: 'hya',
  ひゅ: 'hyu',
  ひょ: 'hyo',
  びゃ: 'bya',
  びゅ: 'byu',
  びょ: 'byo',
  ぴゃ: 'pya',
  ぴゅ: 'pyu',
  ぴょ: 'pyo',
  みゃ: 'mya',
  みゅ: 'myu',
  みょ: 'myo',
  りゃ: 'rya',
  りゅ: 'ryu',
  りょ: 'ryo',
};
const PUNCT = {
  '「': '\u201C',
  '」': '\u201D',
  '、': ', ',
  '。': '. ',
  '『': '\u201C',
  '』': '\u201D',
};

function convertKana(str) {
  let out = '',
    i = 0;
  while (i < str.length) {
    const two = str.slice(i, i + 2);
    if (KANA[two]) {
      out += KANA[two];
      i += 2;
      continue;
    }
    const c = str[i];
    if (c === 'っ') {
      const nextTwo = str.slice(i + 1, i + 3);
      const nextRomaji = KANA[nextTwo] || KANA[str[i + 1]] || '';
      if (nextRomaji) out += nextRomaji[0];
      i += 1;
      continue;
    }
    if (c === 'ー') {
      out += out.slice(-1);
      i += 1;
      continue;
    }
    if (KANA[c]) {
      out += KANA[c];
      i += 1;
      continue;
    }
    if (PUNCT[c]) {
      out += PUNCT[c];
      i += 1;
      continue;
    }
    out += c;
    i += 1;
  }
  return out;
}

/* ============================================================
   FURIGANA DICTIONARY + MEANINGS  (Genesis 1 vocabulary)
   ============================================================ */
const DICT = {
  創造: 'そうぞう',
  第一日: 'だいいちにち',
  第二日: 'だいににち',
  第三日: 'だいさんにち',
  第四日: 'だいよんにち',
  第五日: 'だいごにち',
  第六日: 'だいろくにち',
  大空: 'おおぞら',
  青草: 'あおくさ',
  種類: 'しゅるい',
  果樹: 'かじゅ',
  生物: 'せいぶつ',
  祝福: 'しゅくふく',
  自分: 'じぶん',
  全地: 'ぜんち',
  食物: 'しょくもつ',
  家畜: 'かちく',
  神: 'かみ',
  天: 'てん',
  地: 'ち',
  形: 'かたち',
  淵: 'ふち',
  霊: 'れい',
  水: 'みず',
  光: 'ひかり',
  言: 'い',
  見: 'み',
  良: 'よ',
  分: 'わ',
  昼: 'ひる',
  名: 'な',
  夜: 'よる',
  夕: 'ゆう',
  朝: 'あさ',
  間: 'あいだ',
  造: 'つく',
  下: 'した',
  上: 'うえ',
  一: 'ひと',
  所: 'ところ',
  現: 'あらわ',
  陸: 'りく',
  集: 'あつ',
  海: 'うみ',
  種: 'たね',
  実: 'み',
  結: 'むす',
  生: 'しょう',
  木: 'き',
  物: 'もの',
  星: 'ほし',
  小: 'ちい',
  大: 'おお',
  二: 'ふた',
  置: 'お',
  照: 'て',
  飛: 'と',
  獣: 'けもの',
  鳥: 'とり',
  群: 'むれ',
  動: 'うご',
  羽: 'はね',
  這: 'は',
  治: 'おさ',
  人: 'ひと',
  男: 'おとこ',
  女: 'おんな',
  彼: 'かれ',
  従: 'したが',
  魚: 'さかな',
  空: 'そら',
  与: 'あた',
  命: 'いのち',
};
const MEANINGS = {
  創造: 'to create',
  第一日: 'the first day',
  第二日: 'the second day',
  第三日: 'the third day',
  第四日: 'the fourth day',
  第五日: 'the fifth day',
  第六日: 'the sixth day',
  大空: 'sky, expanse',
  青草: 'green plants',
  種類: 'kind, species',
  果樹: 'fruit tree',
  生物: 'living creature',
  祝福: 'blessing',
  自分: 'oneself',
  全地: 'the whole earth',
  食物: 'food',
  家畜: 'livestock',
  神: 'God',
  天: 'heaven, sky',
  地: 'earth, ground',
  形: 'shape, form',
  淵: 'the deep, abyss',
  霊: 'spirit',
  水: 'water',
  光: 'light',
  言: 'to say',
  見: 'to see',
  良: 'good',
  分: 'to separate',
  昼: 'daytime',
  名: 'name; to name',
  夜: 'night',
  夕: 'evening',
  朝: 'morning',
  間: 'space, interval',
  造: 'to make',
  下: 'below, under',
  上: 'above, upper',
  一: 'one',
  所: 'place',
  現: 'to appear',
  陸: 'dry land',
  集: 'to gather',
  海: 'sea',
  種: 'seed',
  実: 'fruit, seed',
  結: 'to bear (fruit)',
  生: 'to grow / occur',
  木: 'tree',
  物: 'thing',
  星: 'star',
  小: 'small',
  大: 'big',
  二: 'two',
  置: 'to place, set',
  照: 'to shine',
  飛: 'to fly',
  獣: 'beast, animal',
  鳥: 'bird',
  群: 'flock, swarm',
  動: 'to move',
  羽: 'wing, feather',
  這: 'to creep',
  治: 'to rule',
  人: 'person, mankind',
  男: 'man',
  女: 'woman',
  彼: 'he',
  従: 'to obey, submit',
  魚: 'fish',
  空: 'sky',
  与: 'to give',
  命: 'life',
};
const VOCAB_BANK = Object.keys(DICT)
  .filter((k) => MEANINGS[k])
  .map((k) => ({ jp: k, reading: DICT[k], meaning: MEANINGS[k] }));

const isKanji = (c) => /[\u4E00-\u9FFF\u3005]/.test(c);
function annotate(text, overrides = {}) {
  const tokens = [];
  let i = 0;
  while (i < text.length) {
    if (isKanji(text[i])) {
      let j = i;
      while (j < text.length && isKanji(text[j])) j++;
      const run = text.slice(i, j);
      if (overrides[run]) tokens.push({ t: run, r: overrides[run] });
      else if (DICT[run]) tokens.push({ t: run, r: DICT[run] });
      else for (const ch of run) tokens.push({ t: ch, r: DICT[ch] || null });
      i = j;
    } else {
      let j = i;
      while (j < text.length && !isKanji(text[j])) j++;
      tokens.push({ t: text.slice(i, j), r: null });
      i = j;
    }
  }
  return tokens;
}
function tokenRomaji(tok) {
  if (tok.r) return convertKana(tok.r);
  if (tok.t === 'は') return 'wa';
  return convertKana(tok.t);
}
function verseRomaji(tokens) {
  return tokens.map(tokenRomaji).join('').replace(/\s+/g, ' ').trim();
}
function jpRomaji(text) {
  return verseRomaji(annotate(text));
}


const BOOKS = [
  ['創世記', 'Genesis', 50],
  ['出エジプト記', 'Exodus', 40],
  ['レビ記', 'Leviticus', 27],
  ['民数記', 'Numbers', 36],
  ['申命記', 'Deuteronomy', 34],
  ['ヨシュア記', 'Joshua', 24],
  ['士師記', 'Judges', 21],
  ['ルツ記', 'Ruth', 4],
  ['サムエル記上', '1 Samuel', 31],
  ['サムエル記下', '2 Samuel', 24],
  ['列王紀上', '1 Kings', 22],
  ['列王紀下', '2 Kings', 25],
  ['歴代志上', '1 Chronicles', 29],
  ['歴代志下', '2 Chronicles', 36],
  ['エズラ記', 'Ezra', 10],
  ['ネヘミヤ記', 'Nehemiah', 13],
  ['エステル記', 'Esther', 10],
  ['ヨブ記', 'Job', 42],
  ['詩篇', 'Psalms', 150],
  ['箴言', 'Proverbs', 31],
  ['伝道の書', 'Ecclesiastes', 12],
  ['雅歌', 'Song of Songs', 8],
  ['イザヤ書', 'Isaiah', 66],
  ['エレミヤ書', 'Jeremiah', 52],
  ['哀歌', 'Lamentations', 5],
  ['エゼキエル書', 'Ezekiel', 48],
  ['ダニエル書', 'Daniel', 12],
  ['ホセア書', 'Hosea', 14],
  ['ヨエル書', 'Joel', 3],
  ['アモス書', 'Amos', 9],
  ['オバデヤ書', 'Obadiah', 1],
  ['ヨナ書', 'Jonah', 4],
  ['ミカ書', 'Micah', 7],
  ['ナホム書', 'Nahum', 3],
  ['ハバクク書', 'Habakkuk', 3],
  ['ゼパニヤ書', 'Zephaniah', 3],
  ['ハガイ書', 'Haggai', 2],
  ['ゼカリヤ書', 'Zechariah', 14],
  ['マラキ書', 'Malachi', 4],
  ['マタイによる福音書', 'Matthew', 28],
  ['マルコによる福音書', 'Mark', 16],
  ['ルカによる福音書', 'Luke', 24],
  ['ヨハネによる福音書', 'John', 21],
  ['使徒行伝', 'Acts', 28],
  ['ローマ人への手紙', 'Romans', 16],
  ['コリント人への第一の手紙', '1 Corinthians', 16],
  ['コリント人への第二の手紙', '2 Corinthians', 13],
  ['ガラテヤ人への手紙', 'Galatians', 6],
  ['エペソ人への手紙', 'Ephesians', 6],
  ['ピリピ人への手紙', 'Philippians', 4],
  ['コロサイ人への手紙', 'Colossians', 4],
  ['テサロニケ人への第一の手紙', '1 Thessalonians', 5],
  ['テサロニケ人への第二の手紙', '2 Thessalonians', 3],
  ['テモテへの第一の手紙', '1 Timothy', 6],
  ['テモテへの第二の手紙', '2 Timothy', 4],
  ['テトスへの手紙', 'Titus', 3],
  ['ピレモンへの手紙', 'Philemon', 1],
  ['ヘブル人への手紙', 'Hebrews', 13],
  ['ヤコブの手紙', 'James', 5],
  ['ペテロの第一の手紙', '1 Peter', 5],
  ['ペテロの第二の手紙', '2 Peter', 3],
  ['ヨハネの第一の手紙', '1 John', 5],
  ['ヨハネの第二の手紙', '2 John', 1],
  ['ヨハネの第三の手紙', '3 John', 1],
  ['ユダの手紙', 'Jude', 1],
  ['ヨハネの黙示録', 'Revelation', 22],
];
const TOTAL_CHAPTERS = BOOKS.reduce((s, b) => s + b[2], 0);

/* ============================================================
   GRAMMAR / PARTICLES / KANJI TIPS
   ============================================================ */
const PARTICLES = [
  {
    p: 'は',
    reading: 'wa',
    role: 'Topic marker',
    note: 'Marks what the sentence is about. Written は but pronounced \u201Cwa\u201D.',
    example: '神は光を昼と名づけ',
    exampleEn: 'As for God \u2014 he named the light \u2018Day\u2019.',
  },
  {
    p: 'が',
    reading: 'ga',
    role: 'Subject marker',
    note: 'Marks the grammatical subject, often introducing new information.',
    example: '光があった',
    exampleEn: 'There was light.',
  },
  {
    p: 'を',
    reading: 'o',
    role: 'Object marker',
    note: 'Marks the direct object of a verb.',
    example: '天と地とを創造された',
    exampleEn: 'created the heavens and the earth.',
  },
  {
    p: 'に',
    reading: 'ni',
    role: 'Time / location / target',
    note: 'Marks a point in time, a location of existence, or a target.',
    example: 'はじめに',
    exampleEn: 'in the beginning.',
  },
  {
    p: 'と',
    reading: 'to',
    role: '\u2018And\u2019 / quotation',
    note: 'Connects nouns like \u201Cand\u201D, or marks quoted speech before 言う.',
    example: '天と地',
    exampleEn: 'heaven and earth.',
  },
  {
    p: 'の',
    reading: 'no',
    role: 'Possessive \u2018of\u2019',
    note: 'Links two nouns, similar to \u2019s or \u201Cof\u201D.',
    example: '神の霊',
    exampleEn: 'the Spirit of God.',
  },
  {
    p: 'で',
    reading: 'de',
    role: 'Means / location of action',
    note: 'Marks the means by which something is done, or where an action happens.',
    example: '生物の群れで満ち',
    exampleEn: 'teeming with living creatures.',
  },
  {
    p: 'も',
    reading: 'mo',
    role: '\u2018Also / too\u2019',
    note: 'Replaces は or が to add the meaning \u201Calso\u201D.',
    example: '（general use）',
    exampleEn: '',
  },
];
const GRAMMAR_NOTES = [
  {
    title: 'Divine passive: 〜れる／〜られる',
    body: "Genesis 1 often uses the passive form for God's actions, reverently: 創造された (was created), 名づけられた (was named), 祝福された (was blessed).",
    example: '神は天と地とを創造された。',
    note2: 'v.1',
  },
  {
    title: 'Literary copula: 〜である',
    body: 'である is a formal, written version of です／だ. It gives the text a solemn, literary register.',
    example: '第一日である。',
    note2: 'v.5',
  },
  {
    title: 'Command form: 〜よ',
    body: 'Adding よ to a verb stem makes a solemn command \u2014 close to \u201CLet there be...\u201D',
    example: '光あれ',
    note2: 'v.3',
  },
  {
    title: '\u2018Let us...\u2019: 〜させよう',
    body: "The causative-volitional 〜させよう means \u201Clet (someone) do\u201D plus \u201Clet's\u201D.",
    example: '人を造り…治めさせよう',
    note2: 'v.26',
  },
  {
    title: 'Refrain: そのようになった',
    body: 'A recurring phrase meaning \u201Cand it was so\u201D, appearing after almost every creative command.',
    example: 'そのようになった。',
    note2: 'v.7, 9, 11, 15, 24',
  },
];
const KANJI_TIPS = [
  {
    title: '示 / 礻 \u2014 the \u2018altar\u2019 radical',
    body: '神 (God) and 祝 (as in 祝福, blessing) both contain this radical, originally a picture of an altar. Spotting 示 or 礻 in a kanji is a strong hint it relates to ritual, spirits, or the divine.',
    examples: ['神', '祝'],
  },
  {
    title: '生 has more readings than almost any kanji',
    body: "In Genesis 1 alone it's read しょう (生じた, occurred), は (生えさせよ, to grow), and う (生めよ, be fruitful) \u2014 the same character bends to fit very different verbs. Context always decides the reading.",
    examples: ['生'],
  },
  {
    title: 'Animal kanji started as pictures',
    body: '鳥 (bird), 魚 (fish), and 羽 (wing/feather) are simplified drawings of the thing they mean. Look for the wings inside 羽 and the fin-like strokes at the bottom of 魚.',
    examples: ['鳥', '魚', '羽'],
  },
  {
    title: 'Compounds stack meaning like blocks',
    body: '種類 (kind/species) = 種 (seed) + 類 (category) \u2014 literally \u2018seed-category\u2019. 生物 (living creature) = 生 (life) + 物 (thing) \u2014 \u2018life-thing\u2019. Once you know the parts, many compounds become guessable.',
    examples: ['種類', '生物'],
  },
  {
    title: '夕 and 朝 bookend the day',
    body: '夕 (evening) and 朝 (morning) show up together throughout Genesis 1 in the refrain \u201C夕となり、また朝となった\u201D \u2014 a natural pair to learn together.',
    examples: ['夕', '朝'],
  },
  {
    title: '造る vs 創造 \u2014 plain vs formal \u2018to make\u2019',
    body: '造る (つくる) is the everyday word for \u2018to make\u2019; 創造 (そうぞう) is the weightier, formal word for \u2018to create\u2019. Genesis uses both \u2014 noticing which appears where is a clue to emphasis.',
    examples: ['造', '創造'],
  },
];

/* ============================================================
   DATE / STREAK HELPERS
   ============================================================ */
const todayStr = () => new Date().toISOString().slice(0, 10);
const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
function daysAgoStr(n) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().slice(0, 10);
}
function computeStreak(activityDates) {
  const set = new Set(activityDates);
  if (!set.has(todayStr()) && !set.has(daysAgoStr(1))) return 0;
  let streak = 0;
  const start = set.has(todayStr()) ? 0 : 1;
  for (let i = start; i < 400; i++) {
    if (set.has(daysAgoStr(i))) streak++;
    else break;
  }
  return streak;
}
const DEFAULT_PROGRESS = {
  readChapters: {},
  readingLog: [],
  studyLog: [],
  weeklyGoal: 3,
  dailyCardGoal: 10,
  dailyMinuteGoal: 10,
  todayStats: { date: todayStr(), cards: 0, minutes: 0 },
  reminder: { enabled: false, time: '08:00', days: [1, 2, 3, 4, 5] },
};
function freshTodayStats(stats) {
  if (!stats || stats.date !== todayStr())
    return { date: todayStr(), cards: 0, minutes: 0 };
  return stats;
}

/* ============================================================
   SHARED ATOMS
   ============================================================ */
const PAPER = '#F2ECE0',
  INK = '#241F19',
  SUB = '#7A6A52',
  INDIGO = '#233350',
  VERM = '#B8402F',
  CARD = '#FBF7EE',
  LINE = '#E7DCC4';

function Seal({ children }) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: 30,
        height: 30,
        borderRadius: 6,
        border: '1.5px solid #B8402F',
        color: '#B8402F',
        fontFamily: "'Shippori Mincho', serif",
        fontWeight: 700,
        fontSize: 13,
        padding: '0 6px',
        flexShrink: 0,
      }}
    >
      {children}
    </span>
  );
}
function RubyToken({ tok, showFurigana, onTap }) {
  const clickable = tok.r && MEANINGS[tok.t];
  const content = tok.r ? (
    <ruby>
      {tok.t}
      <rt
        style={{
          fontSize: '0.5em',
          color: '#7A6A52',
          userSelect: 'none',
          visibility: showFurigana ? 'visible' : 'hidden',
        }}
      >
        {tok.r}
      </rt>
    </ruby>
  ) : (
    tok.t
  );
  return (
    <span
      onClick={clickable ? () => onTap(tok) : undefined}
      style={{
        cursor: clickable ? 'pointer' : 'default',
        borderBottom: clickable ? '1px dotted #C9BBA0' : 'none',
      }}
      onMouseEnter={(e) => {
        if (clickable) e.currentTarget.style.background = '#F2E3D8';
      }}
      onMouseLeave={(e) => {
        if (clickable) e.currentTarget.style.background = 'transparent';
      }}
    >
      {content}
    </span>
  );
}
function Btn({ active, onClick, children, style }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        fontSize: 13,
        padding: '7px 12px',
        borderRadius: 7,
        border: `1px solid ${active ? INDIGO : '#DDD0B8'}`,
        background: active ? INDIGO : 'transparent',
        color: active ? '#fff' : INK,
        cursor: 'pointer',
        fontFamily: "'Source Serif 4', Georgia, serif",
        ...style,
      }}
    >
      {children}
    </button>
  );
}
function StatCard({ icon, label, value }) {
  return (
    <div
      style={{
        background: CARD,
        border: `1px solid ${LINE}`,
        borderRadius: 12,
        padding: 16,
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          color: SUB,
          fontSize: 12.5,
        }}
      >
        {icon} {label}
      </div>
      <div
        style={{ fontSize: 24, fontWeight: 700, color: INDIGO, marginTop: 6 }}
      >
        {value}
      </div>
    </div>
  );
}
function ProgressBar({ value, max }) {
  const pct = Math.min(100, Math.round((value / Math.max(max, 1)) * 100));
  return (
    <div
      style={{
        background: '#E6DAC2',
        borderRadius: 20,
        height: 8,
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          width: `${pct}%`,
          height: '100%',
          background: pct >= 100 ? '#3C7A4E' : VERM,
          transition: 'width 0.3s',
        }}
      />
    </div>
  );
}

/* ============================================================
   CLOUD SYNC (optional) — paste your own free Firebase project's
   config below to enable syncing between your phone and computer.
   Get this from: Firebase Console → Project settings → your web app.
   Leave the placeholders as-is if you don't want cloud sync — the
   app works fine without it, just per-device.
   ============================================================ */
const FIREBASE_CONFIG = {
  apiKey: 'AIzaSyCMj6Y02COjMLOddxsm3VdzHda9a6-rpBc',
  authDomain: 'japanese-bible-learning-app.firebaseapp.com',
  projectId: 'japanese-bible-learning-app',
  storageBucket: 'japanese-bible-learning-app.firebasestorage.app',
  messagingSenderId: '920765447505',
  appId: '1:920765447505:web:f02420d344964aecfa2770',
};
const firebaseApp =
  getApps().length > 0 ? getApp() : initializeApp(FIREBASE_CONFIG);

const firebaseAuth = getAuth(firebaseApp);
const googleProvider = new GoogleAuthProvider();

let _fbDb = null;

function getCloudDb() {
  if (_fbDb) return _fbDb;

  if (!FIREBASE_CONFIG.apiKey || FIREBASE_CONFIG.apiKey.startsWith('PASTE_')) {
    return null;
  }

  try {
    _fbDb = getFirestore(firebaseApp);
    return _fbDb;
  } catch (e) {
    console.error('Firebase init failed', e);
    return null;
  }
}
async function cloudLoad(code) {
  const db = getCloudDb();
  if (!db || !code) return null;
  try {
    const snap = await getDoc(doc(db, 'yomuBible', code));
    return snap.exists() ? snap.data() : null;
  } catch (e) {
    console.error('Cloud load failed', e);
    return null;
  }
}
async function cloudSave(code, data) {
  const db = getCloudDb();
  if (!db || !code) return false;
  try {
    await setDoc(doc(db, 'yomuBible', code), {
      ...data,
      updatedAt: Date.now(),
    });
    return true;
  } catch (e) {
    console.error('Cloud save failed', e);
    return false;
  }
}
const isCloudConfigured = () => !!getCloudDb();

/* ============================================================
   STORAGE — uses Claude's window.storage when available (inside
   claude.ai), and falls back to the browser's own localStorage
   automatically when this app is run on its own website. This
   means the exact same file works in both places.
   ============================================================ */
const storage =
  typeof window !== 'undefined' &&
  window.storage &&
  typeof window.storage.get === 'function'
    ? window.storage
    : {
        async get(key) {
          try {
            const v = localStorage.getItem(key);
            return v === null ? null : { key, value: v };
          } catch (e) {
            return null;
          }
        },
        async set(key, value) {
          try {
            localStorage.setItem(key, value);
            return { key, value };
          } catch (e) {
            return null;
          }
        },
        async delete(key) {
          try {
            localStorage.removeItem(key);
            return { key, deleted: true };
          } catch (e) {
            return null;
          }
        },
      };

/* ============================================================
   MAIN APP
   ============================================================ */
export default function App() {
  useFonts();

  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebaseAuth, (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
    });

    return unsubscribe;
  }, []);

  const [page, setPage] = useState('home'); // home | read | flashcards | more
  const [currentChapter, setCurrentChapter] = useState(1); // Start with Genesis 1
  const [showFurigana, setShowFurigana] = useState(true);
  const [showRomaji, setShowRomaji] = useState(false);
  const [showTranslation, setShowTranslation] = useState(true);
  const [rate, setRate] = useState(0.85);
  const [popup, setPopup] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [toast, setToast] = useState('');
  const [playingIdx, setPlayingIdx] = useState(null);
  const [chapterPlaying, setChapterPlaying] = useState(false);
  const [audioWarning, setAudioWarning] = useState(false);
  const [flashcards, setFlashcards] = useState([]);
  const [reviewIdx, setReviewIdx] = useState(0);
  const [reviewFlipped, setReviewFlipped] = useState(false);
  const [voices, setVoices] = useState([]);
  const [progress, setProgress] = useState(DEFAULT_PROGRESS);
  const [goalInput, setGoalInput] = useState(3);
  const [cardGoalInput, setCardGoalInput] = useState(10);
  const [minuteGoalInput, setMinuteGoalInput] = useState(10);
  const [reminderTime, setReminderTime] = useState('08:00');
  const [reminderDays, setReminderDays] = useState([1, 2, 3, 4, 5]);
  const [syncStatus, setSyncStatus] = useState('idle');

  const stopRef = useRef(false);
  const utterRef = useRef(null);
  const startTimeoutRef = useRef(null);
  const readVerseRefs = useRef({});
  const CH_KEY = 'Genesis-1';

  useEffect(() => {
    const load = () => setVoices(window.speechSynthesis?.getVoices() || []);
    load();
    window.speechSynthesis?.addEventListener?.('voiceschanged', load);
    return () =>
      window.speechSynthesis?.removeEventListener?.('voiceschanged', load);
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const r = await storage.get('flashcards', false);
        if (r?.value) setFlashcards(JSON.parse(r.value));
      } catch (e) {}
      try {
        const r2 = await storage.get('progress', false);
        const p = r2?.value
          ? { ...DEFAULT_PROGRESS, ...JSON.parse(r2.value) }
          : DEFAULT_PROGRESS;
        p.todayStats = freshTodayStats(p.todayStats);
        setProgress(p);
        setGoalInput(p.weeklyGoal);
        setCardGoalInput(p.dailyCardGoal);
        setMinuteGoalInput(p.dailyMinuteGoal);
        setReminderTime(p.reminder?.time || '08:00');
        setReminderDays(p.reminder?.days || [1, 2, 3, 4, 5]);
      } catch (e) {}
      // Legacy sync-code loading is disabled.
      // Account data is now loaded through the authenticated user's UID.
    })();
  }, []);

  useEffect(() => {
    if (!user) return;
    (async () => {
      try {
        setSyncStatus('syncing');
        const cloudData = await cloudLoad(user.uid);
        if (cloudData) {
          if (cloudData.flashcards) setFlashcards(cloudData.flashcards);
          if (cloudData.progress) {
            const p2 = {
              ...DEFAULT_PROGRESS,
              ...cloudData.progress,
              todayStats: freshTodayStats(cloudData.progress.todayStats),
            };
            setProgress(p2);
            setGoalInput(p2.weeklyGoal);
            setCardGoalInput(p2.dailyCardGoal);
            setMinuteGoalInput(p2.dailyMinuteGoal);
          }
        } else {
          await cloudSave(user.uid, { flashcards, progress });
        }
        setSyncStatus('connected');
      } catch (e) {
        console.error('User cloud load failed', e);
        setSyncStatus('error');
      }
    })();
  }, [user]);

  // reminder loop — fires only while this tab stays open
  useEffect(() => {
    const id = setInterval(() => {
      if (!progress.reminder?.enabled) return;
      const now = new Date();
      const hh = String(now.getHours()).padStart(2, '0'),
        mm = String(now.getMinutes()).padStart(2, '0');
      if (
        `${hh}:${mm}` === progress.reminder.time &&
        progress.reminder.days.includes(now.getDay())
      ) {
        if (window.Notification && Notification.permission === 'granted')
          new Notification('Time for your Japanese Bible reading \uD83D\uDCD6');
        else showToast("\uD83D\uDCD6 Reminder: time for today's reading");
      }
    }, 30000);
    return () => clearInterval(id);
  }, [progress.reminder]);

  // study-time timer: accrues while the Flashcards page is open
  useEffect(() => {
    if (page !== 'flashcards') return;
    const id = setInterval(() => {
      setProgress((prev) => {
        const stats = freshTodayStats(prev.todayStats);
        const updated = {
          ...prev,
          todayStats: { ...stats, minutes: stats.minutes + 1 },
        };
        storage.set('progress', JSON.stringify(updated), false).catch(() => {});
        return updated;
      });
    }, 60000);
    return () => clearInterval(id);
  }, [page]);

  const persistCards = useCallback(
    async (cards) => {
      setFlashcards(cards);
      try {
        await storage.set('flashcards', JSON.stringify(cards), false);
      } catch (e) {}
      if (user) {
        await cloudSave(user.uid, { flashcards: cards, progress });
      }
    },
    [user, progress]
  );

  const persistProgress = useCallback(
    async (p) => {
      setProgress(p);
      try {
        await storage.set('progress', JSON.stringify(p), false);
      } catch (e) {}
      if (user) {
        await cloudSave(user.uid, { flashcards, progress: p });
      }
    },
    [user, flashcards]
  );

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2400);
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithPopup(firebaseAuth, googleProvider);
    } catch (error) {
      console.error('Google sign-in failed:', error);
      alert(error?.message || 'Google sign-in failed.');
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(firebaseAuth);
    } catch (error) {
      console.error('Sign-out failed:', error);
    }
  };

  const addFlashcard = (tok, verseNum) => {
    const jp = tok.t,
      meaning = MEANINGS[jp];
    if (flashcards.some((c) => c.jp === jp)) {
      showToast(`${jp} is already saved`);
      return;
    }
    const verse =
      GENESIS_1.find((v) => v.v === verseNum) ||
      GENESIS_1.find((v) => v.jp.includes(jp));
    const card = {
      id: `${jp}-${Date.now()}`,
      jp,
      reading: tok.r,
      romaji: convertKana(tok.r),
      meaning,
      box: 1,
      due: Date.now(),
      exVerse: verse
        ? { ref: `Genesis 1:${verse.v}`, jp: verse.jp, en: verse.en }
        : null,
    };
    persistCards([...flashcards, card]);
    showToast(`Added ${jp} to flashcards`);
  };
  const addAllChapterVocab = (currentChapter) => { // Add currentChapter here
    const seen = new Map();
    const chapterContent = CHAPTER_DATA[currentChapter] || GENESIS_1; // Use CHAPTER_DATA
    chapterContent.forEach((verse) => { // Use chapterContent
      annotate(verse.jp, verse.overrides).forEach((tok) => {
        if (tok.r && MEANINGS[tok.t] && !seen.has(tok.t))
          seen.set(tok.t, { tok, verse });
      });
    });
    const existing = new Set(flashcards.map((c) => c.jp));
    const additions = [...seen.values()]
      .filter(({ tok }) => !existing.has(tok.t))
      .map(({ tok, verse }) => ({
        id: `${tok.t}-${Date.now()}-${Math.random()}`,
            jp: tok.t,
            reading: tok.r,
            romaji: convertKana(tok.r),
            meaning: MEANINGS[tok.t],
            box: 1,
            due: Date.now(),
            exVerse: { ref: `Genesis ${currentChapter}:${verse.v}`, jp: verse.jp, en: verse.en }, // Make ref dynamic
      }));
    if (additions.length === 0) {
      showToast('All chapter words already saved');
      return;
    }
    persistCards([...flashcards, ...additions]);
    showToast(`Added ${additions.length} words from Genesis ${currentChapter}`); // Make toast dynamic
  };

  /* ---------- Audio (hardened) ---------- */
  const speak = (text, onend) => {
    if (!window.speechSynthesis) {
      showToast("Speech isn't supported in this browser");
      setChapterPlaying(false);
      setPlayingIdx(null);
      return;
    }
    try {
      window.speechSynthesis.cancel();
      clearTimeout(startTimeoutRef.current);
      setTimeout(() => {
        const u = new SpeechSynthesisUtterance(text);
        u.lang = 'ja-JP';
        u.rate = rate;
        const freshVoices = window.speechSynthesis.getVoices();
        const jaVoice =
          freshVoices.find((v) => v.lang?.startsWith('ja')) ||
          voices.find((v) => v.lang?.startsWith('ja'));
        if (jaVoice) u.voice = jaVoice;
        let started = false;
        u.onstart = () => {
          started = true;
          setAudioWarning(false);
        };
        u.onend = () => {
          onend?.();
        };
        u.onerror = () => {
          showToast(
            'Playback was interrupted \u2014 try the speaker icon on a single verse instead'
          );
          setChapterPlaying(false);
          setPlayingIdx(null);
        };
        utterRef.current = u; // keep a strong reference so it isn't garbage-collected mid-speech
        window.speechSynthesis.speak(u);
        startTimeoutRef.current = setTimeout(() => {
          if (!started) {
            setAudioWarning(true);
            showToast(
              "Audio didn't start \u2014 your browser may be blocking automatic playback. Try tapping the speaker icon on a single verse."
            );
            setChapterPlaying(false);
            setPlayingIdx(null);
          }
        }, 2500);
      }, 60);
    } catch (e) {
      showToast("Couldn't start audio in this browser");
      setChapterPlaying(false);
      setPlayingIdx(null);
    }
  };
  const playVerse = (i) => {
    setChapterPlaying(false);
    stopRef.current = true;
    setPlayingIdx(i);
    const chapterContent = CHAPTER_DATA[currentChapter] || GENESIS_1;
    speak(chapterContent[i].jp, () => setPlayingIdx(null));
  };
  const playChapter = () => {
    if (chapterPlaying) {
      stopRef.current = true;
      window.speechSynthesis?.cancel();
      setChapterPlaying(false);
      setPlayingIdx(null);
      return;
    }
    stopRef.current = false;
    setChapterPlaying(true);
    let i = 0;
    const next = () => {
      if (stopRef.current || i >= GENESIS_1.length) {
        setChapterPlaying(false);
        setPlayingIdx(null);
        return;
      }
      setPlayingIdx(i);
      speak(GENESIS_1[i].jp, () => {
        i += 1;
        next();
      });
    };
    next();
  };

  /* ---------- Reading progress ---------- */
  const isRead = !!progress.readChapters[CH_KEY]?.read;
  const markChapter = (read) => {
    const readChapters = {
      ...progress.readChapters,
      [CH_KEY]: { read, lastReadAt: Date.now() },
    };
    const readingLog =
      read && !progress.readingLog.includes(todayStr())
        ? [...progress.readingLog, todayStr()]
        : progress.readingLog;
    persistProgress({ ...progress, readChapters, readingLog });
    showToast(
      read ? 'Marked Genesis 1 as finished \u2713' : 'Marked as unread'
    );
  };
  const saveWeeklyGoal = () => {
    persistProgress({ ...progress, weeklyGoal: goalInput });
    showToast('Weekly goal saved');
  };
  const saveDailyGoals = () => {
    persistProgress({
      ...progress,
      dailyCardGoal: cardGoalInput,
      dailyMinuteGoal: minuteGoalInput,
    });
    showToast('Daily study goals saved');
  };
  const saveReminder = async () => {
    if (window.Notification && Notification.permission === 'default') {
      try {
        await Notification.requestPermission();
      } catch (e) {}
    }
    persistProgress({
      ...progress,
      reminder: { enabled: true, time: reminderTime, days: reminderDays },
    });
    showToast('Reminder set (works while this tab is open)');
  };
  const disableReminder = () => {
    persistProgress({
      ...progress,
      reminder: { ...progress.reminder, enabled: false },
    });
    showToast('Reminder turned off');
  };

  /* ---------- Flashcards / SRS ---------- */
  const dueCards = useMemo(
    () => flashcards.filter((c) => c.due <= Date.now()),
    [flashcards]
  );
  const reviewDeck = dueCards.length ? dueCards : flashcards;
  const currentCard = reviewDeck[reviewIdx % Math.max(reviewDeck.length, 1)];
  const gradeCard = (know) => {
    if (!currentCard) return;
    const box = know ? Math.min(currentCard.box + 1, 5) : 1;
    const daysOut = [0, 1, 2, 4, 7, 14][box];
    const due = Date.now() + daysOut * 24 * 60 * 60 * 1000;
    persistCards(
      flashcards.map((c) => (c.id === currentCard.id ? { ...c, box, due } : c))
    );
    const stats = freshTodayStats(progress.todayStats);
    const studyLog = progress.studyLog.includes(todayStr())
      ? progress.studyLog
      : [...progress.studyLog, todayStr()];
    persistProgress({
      ...progress,
      studyLog,
      todayStats: { ...stats, cards: stats.cards + 1 },
    });
    setReviewFlipped(false);
    setReviewIdx((n) => n + 1);
  };

  const chaptersRead = Object.values(progress.readChapters).filter(
    (c) => c.read
  ).length;
  const streak = computeStreak([
    ...new Set([...progress.readingLog, ...progress.studyLog]),
  ]);
  const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  const thisWeekCount = Object.values(progress.readChapters).filter(
    (c) => c.read && c.lastReadAt >= weekAgo
  ).length;
  const todayStats = freshTodayStats(progress.todayStats);

  const NAV = [
    { id: 'home', label: 'Home', icon: <HomeIcon size={15} /> },
    { id: 'read', label: 'Read', icon: <BookOpen size={15} /> },
    { id: 'flashcards', label: 'Flashcards', icon: <Layers size={15} /> },
    { id: 'more', label: 'More', icon: <Gamepad2 size={15} /> },
  ];

  if (authLoading) {
    return <div style={{ padding: 40, textAlign: 'center' }}>Loading...</div>;
  }

  if (!user) {
    return (
      <div style={{ padding: 40, textAlign: 'center' }}>
        <h1>Japanese Bible Reader</h1>
        <p>Sign in to continue.</p>
        <button onClick={handleGoogleSignIn}>Sign in with Google</button>
      </div>
    );
  }
  return (
    <div
      style={{
        display: 'flex',
        height: '100vh',
        background: PAPER,
        color: INK,
        fontFamily: "'Source Serif 4', Georgia, serif",
      }}
    >
      {/* Sidebar (book/chapter list) */}
      <aside
        style={{
          width: sidebarOpen ? 270 : 0,
          transition: 'width 0.2s ease',
          overflow: 'hidden',
          borderRight: sidebarOpen ? `1px solid #DDD0B8` : 'none',
          background: '#EDE4D2',
          flexShrink: 0,
        }}
      >
        <div
          style={{
            width: 270,
            height: '100%',
            overflowY: 'auto',
            padding: '18px 14px',
          }}
        >
          <div
            style={{
              fontFamily: "'Shippori Mincho', serif",
              fontWeight: 700,
              fontSize: 19,
              color: INDIGO,
              marginBottom: 4,
            }}
          >
            聖書で学ぶ日本語
          </div>
          <div style={{ fontSize: 11.5, color: SUB, marginBottom: 16 }}>
            Genesis to Revelation
          </div>
          {BOOKS.map(([jp, en, chapters], bi) => {
            const isGenesis = bi === 0;
            return (
              <div key={en} style={{ marginBottom: 2 }}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '7px 8px',
                    borderRadius: 6,
                    fontSize: 13,
                    background: isGenesis ? '#DFCFA8' : 'transparent',
                    color: isGenesis ? INK : '#A99A80',
                  }}
                >
                  <span style={{ fontFamily: "'Noto Serif JP', serif" }}>
                    {jp}
                  </span>
                  {!isGenesis && <Lock size={11} />}
                </div>
                {isGenesis && (
                  <div
                    style={{
                      display: 'flex',
                      gap: 6,
                      flexWrap: 'wrap',
                      padding: '4px 8px 10px 8px',
                    }}
                  >
                                        {Array.from({ length: chapters }).map((_, ci) => {
                      const chapterNum = ci + 1;
                      const isCurrent = chapterNum === currentChapter;
                      const isChapterAvailable = CHAPTER_DATA[chapterNum]; // Check if chapter data exists
                      console.log(`Chapter ${chapterNum}: isChapterAvailable = ${isChapterAvailable}`);
                      return (
                        <span
                          key={ci}
                          onClick={
                            isChapterAvailable
                              ? () => {
                                  setPage('read');
                                  setCurrentChapter(chapterNum); // Set the current chapter
                                  showToast(`Genesis ${chapterNum}`);
                                }
                              : undefined
                          }
                          style={{
                            fontSize: 11,
                            width: 23,
                            height: 23,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: 5,
                            position: 'relative',
                            background: isCurrent ? VERM : (isChapterAvailable ? '#E6DAC2' : '#F0EBE0'), // Highlight current, dim unavailable
                            color: isCurrent ? '#fff' : (isChapterAvailable ? '#B8A985' : '#C0B8A0'), // Text color
                            cursor: isChapterAvailable ? 'pointer' : 'default',
                          }}
                          title={
                            isChapterAvailable
                              ? isCurrent && isRead // Only show read status if it's the current chapter and it's marked read
                                ? `Genesis ${chapterNum} — read`
                                : `Genesis ${chapterNum} — open`
                              : 'Coming soon'
                          }
                        >
                          {chapterNum}
                          {isCurrent && isRead && ( // Show checkmark only if it's the current chapter and marked read
                            <CheckCircle2
                              size={11}
                              style={{
                                position: 'absolute',
                                top: -4,
                                right: -4,
                                background: '#EDE4D2',
                                borderRadius: '50%',
                                color: '#3C7A4E',
                              }}
                            />
                          )}
                        </span>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </aside>

      <main
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          minWidth: 0,
        }}
      >
        {/* Top bar with 4-page nav */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '12px 20px',
            borderBottom: '1px solid #DDD0B8',
            flexWrap: 'wrap',
          }}
        >
          <button
            onClick={() => setSidebarOpen((s) => !s)}
            style={{
              background: 'none',
              border: '1px solid #DDD0B8',
              borderRadius: 7,
              padding: 7,
              cursor: 'pointer',
              color: INK,
            }}
          >
            <Layers size={15} />
          </button>
          <div
            style={{
              fontFamily: "'Shippori Mincho', serif",
              fontSize: 16,
              fontWeight: 700,
              color: INDIGO,
              marginRight: 8,
            }}
          >
            聖書で学ぶ日本語
          </div>
          <div style={{ flex: 1 }} />
          {NAV.map((n) => (
            <Btn
              key={n.id}
              active={page === n.id}
              onClick={() => setPage(n.id)}
            >
              {n.icon} {n.label}
            </Btn>
          ))}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              marginLeft: 8,
              paddingLeft: 10,
              borderLeft: `1px solid ${LINE}`,
            }}
          >
            <span
              title={user?.email || ''}
              style={{
                maxWidth: 150,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                fontSize: 12,
                color: SUB,
              }}
            >
              {user?.displayName || user?.email || 'Signed in'}
            </span>

            <button
              onClick={handleSignOut}
              style={{
                border: `1px solid ${LINE}`,
                borderRadius: 7,
                padding: '7px 10px',
                background: 'transparent',
                color: INK,
                cursor: 'pointer',
                fontSize: 12,
              }}
            >
              Sign out
            </button>
          </div>
        </div>

        {page === 'home' && (
          <HomePage
            streak={streak}
            chaptersRead={chaptersRead}
            totalChapters={TOTAL_CHAPTERS}
            thisWeekCount={thisWeekCount}
            weeklyGoal={progress.weeklyGoal}
            todayStats={todayStats}
            dailyCardGoal={progress.dailyCardGoal}
            dailyMinuteGoal={progress.dailyMinuteGoal}
            readingLog={progress.readingLog}
            studyLog={progress.studyLog}
            isRead={isRead}
            flashcardCount={flashcards.length}
            dueCount={dueCards.length}
            goToRead={() => setPage('read')}
            goToFlashcards={() => setPage('flashcards')}
          />
        )}

        {page === 'read' && (
          <ReadPage
            showFurigana={showFurigana}
            setShowFurigana={setShowFurigana}
            currentChapter={currentChapter}
            setCurrentChapter={setCurrentChapter}
            showRomaji={showRomaji}
            setShowRomaji={setShowRomaji}
            showTranslation={showTranslation}
            setShowTranslation={setShowTranslation}
            rate={rate}
            setRate={setRate}
            playingIdx={playingIdx}
            chapterPlaying={chapterPlaying}
            playVerse={playVerse}
            playChapter={playChapter}
            audioWarning={audioWarning}
            isRead={isRead}
            markChapter={markChapter}
            setPopup={setPopup}
            addAllChapterVocab={addAllChapterVocab}
            showToast={showToast}
          />
        )}

        {page === 'flashcards' && (
          <FlashcardsPage
            reviewDeck={reviewDeck}
            currentCard={currentCard}
            flipped={reviewFlipped}
            setFlipped={setReviewFlipped}
            onGrade={gradeCard}
            total={flashcards.length}
            dueCount={dueCards.length}
            todayStats={todayStats}
            dailyCardGoal={progress.dailyCardGoal}
            dailyMinuteGoal={progress.dailyMinuteGoal}
            cardGoalInput={cardGoalInput}
            setCardGoalInput={setCardGoalInput}
            minuteGoalInput={minuteGoalInput}
            setMinuteGoalInput={setMinuteGoalInput}
            saveDailyGoals={saveDailyGoals}
          />
        )}

        {page === 'more' && (
          <MorePage
            weeklyGoal={progress.weeklyGoal}
            goalInput={goalInput}
            setGoalInput={setGoalInput}
            saveWeeklyGoal={saveWeeklyGoal}
            reminderTime={reminderTime}
            setReminderTime={setReminderTime}
            reminderDays={reminderDays}
            setReminderDays={setReminderDays}
            saveReminder={saveReminder}
            disableReminder={disableReminder}
            reminder={progress.reminder}
            readingLog={progress.readingLog}
            studyLog={progress.studyLog}
            showToast={showToast}
            user={user}
            onSignOut={handleSignOut}
          />
        )}
      </main>

      {popup && (
        <div
          onClick={() => setPopup(null)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(36,31,25,0.35)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 50,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: CARD,
              borderRadius: 14,
              padding: 24,
              width: 300,
              boxShadow: '0 12px 40px rgba(0,0,0,0.25)',
              border: `1px solid ${LINE}`,
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
              }}
            >
              <div
                style={{ fontFamily: "'Noto Serif JP', serif", fontSize: 32 }}
              >
                {popup.t}
              </div>
              <button
                onClick={() => setPopup(null)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: SUB,
                }}
              >
                <X size={18} />
              </button>
            </div>
            <div style={{ color: VERM, fontSize: 15, marginTop: 4 }}>
              {popup.r}
            </div>
            <div style={{ color: SUB, fontSize: 13, marginTop: 2 }}>
              {convertKana(popup.r)}
            </div>
            <div style={{ marginTop: 12, fontSize: 15, lineHeight: 1.5 }}>
              {MEANINGS[popup.t]}
            </div>
            <button
              onClick={() => addFlashcard(popup, popup.verse)}
              style={{
                width: '100%',
                justifyContent: 'center',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                fontSize: 13,
                padding: '9px 12px',
                borderRadius: 7,
                border: `1px solid #DDD0B8`,
                background: 'transparent',
                color: INK,
                cursor: 'pointer',
                marginTop: 16,
              }}
            >
              + Add to flashcards
            </button>
          </div>
        </div>
      )}

      {toast && (
        <div
          style={{
            position: 'fixed',
            bottom: 24,
            left: '50%',
            transform: 'translateX(-50%)',
            background: INDIGO,
            color: '#fff',
            padding: '10px 18px',
            borderRadius: 8,
            fontSize: 13.5,
            zIndex: 60,
            maxWidth: '85%',
            textAlign: 'center',
          }}
        >
          {toast}
        </div>
      )}
    </div>
  );
}

/* ============================================================
   HOME PAGE
   ============================================================ */
function HomePage({
  streak,
  chaptersRead,
  totalChapters,
  thisWeekCount,
  weeklyGoal,
  todayStats,
  dailyCardGoal,
  dailyMinuteGoal,
  readingLog,
  studyLog,
  isRead,
  flashcardCount,
  dueCount,
  goToRead,
  goToFlashcards,
}) {
  const activity = new Set([...readingLog, ...studyLog]);
  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: '28px 24px' }}>
      <div style={{ maxWidth: 720, margin: '0 auto' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            marginBottom: 6,
          }}
        >
          <Flame size={22} color={VERM} />
          <div
            style={{
              fontSize: 22,
              fontWeight: 700,
              color: INDIGO,
              fontFamily: "'Shippori Mincho', serif",
            }}
          >
            {streak}-day streak
          </div>
        </div>
        <div style={{ fontSize: 13.5, color: SUB, marginBottom: 26 }}>
          {streak > 0
            ? 'Keep it going \u2014 read or review at least one word today.'
            : 'Start today to begin your streak.'}
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 14,
            marginBottom: 26,
          }}
        >
          <div
            onClick={goToRead}
            style={{
              cursor: 'pointer',
              background: CARD,
              border: `1px solid ${LINE}`,
              borderRadius: 14,
              padding: 18,
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div style={{ fontWeight: 700, color: INDIGO }}>
                {isRead ? 'Read Genesis 1 again' : 'Continue reading'}
              </div>
              <ChevronRight size={16} color={SUB} />
            </div>
            <div style={{ fontSize: 13, color: SUB, marginTop: 4 }}>
              創世記 Genesis 1{' '}
              {isRead ? '\u2014 already finished \u2713' : '\u2014 31 verses'}
            </div>
          </div>
          <div
            onClick={goToFlashcards}
            style={{
              cursor: 'pointer',
              background: CARD,
              border: `1px solid ${LINE}`,
              borderRadius: 14,
              padding: 18,
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div style={{ fontWeight: 700, color: INDIGO }}>
                Study flashcards
              </div>
              <ChevronRight size={16} color={SUB} />
            </div>
            <div style={{ fontSize: 13, color: SUB, marginTop: 4 }}>
              {dueCount > 0 ? `${dueCount} due now` : `${flashcardCount} saved`}
            </div>
          </div>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 12,
            marginBottom: 28,
          }}
        >
          <StatCard
            icon={<BookOpen size={16} />}
            label="Chapters read"
            value={`${chaptersRead} / ${totalChapters}`}
          />
          <StatCard
            icon={<Target size={16} />}
            label="This week"
            value={`${thisWeekCount} / ${weeklyGoal}`}
          />
          <StatCard
            icon={<Layers size={16} />}
            label="Flashcards"
            value={flashcardCount}
          />
        </div>

        <div
          style={{
            background: CARD,
            border: `1px solid ${LINE}`,
            borderRadius: 14,
            padding: 18,
            marginBottom: 28,
          }}
        >
          <div style={{ fontWeight: 700, color: INDIGO, marginBottom: 12 }}>
            Today's study goal
          </div>
          <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: 180 }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: 12.5,
                  color: SUB,
                  marginBottom: 6,
                }}
              >
                <span>Flashcards</span>
                <span>
                  {todayStats.cards} / {dailyCardGoal}
                </span>
              </div>
              <ProgressBar value={todayStats.cards} max={dailyCardGoal} />
            </div>
            <div style={{ flex: 1, minWidth: 180 }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: 12.5,
                  color: SUB,
                  marginBottom: 6,
                }}
              >
                <span>Minutes</span>
                <span>
                  {todayStats.minutes} / {dailyMinuteGoal}
                </span>
              </div>
              <ProgressBar value={todayStats.minutes} max={dailyMinuteGoal} />
            </div>
          </div>
          <div style={{ fontSize: 11.5, color: SUB, marginTop: 10 }}>
            Set your daily targets on the Flashcards page.
          </div>
        </div>

        <div style={{ fontWeight: 700, color: INDIGO, marginBottom: 10 }}>
          Last 5 weeks
        </div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            gap: 5,
            maxWidth: 280,
          }}
        >
          {Array.from({ length: 35 }).map((_, idx) => {
            const dateStr = daysAgoStr(34 - idx);
            const active = activity.has(dateStr);
            const isToday = dateStr === todayStr();
            return (
              <div
                key={idx}
                title={dateStr}
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 6,
                  background: active ? VERM : '#E6DAC2',
                  border: isToday ? `2px solid ${INDIGO}` : '1px solid #DDD0B8',
                }}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   READ PAGE
   ============================================================ */
function ReadPage({
  showFurigana,
  setShowFurigana,
  showRomaji,
  setShowRomaji,
  showTranslation,
  setShowTranslation,
  rate,
  setRate,
  playingIdx,
  chapterPlaying,
  playVerse,
  playChapter,
  audioWarning,
  isRead,
  markChapter,
  setPopup,
  currentChapter, // Add this
  setCurrentChapter, // Add this
  addAllChapterVocab,
  showToast,
}) {
  const scrollRef = useRef(null);

  const chapterContent = CHAPTER_DATA[currentChapter] || GENESIS_1; // Fallback to Genesis 1 if chapter not found

  return (
    <>
      <div
        style={{
          display: 'flex',
          gap: 10,
          alignItems: 'center',
          padding: '10px 20px',
          flexWrap: 'wrap',
          borderBottom: `1px solid ${LINE}`,
        }}
      >
        <Btn active={showFurigana} onClick={() => setShowFurigana((s) => !s)}>
          {showFurigana && <Check size={13} />} Furigana
        </Btn>
        <Btn active={showRomaji} onClick={() => setShowRomaji((s) => !s)}>
          {showRomaji && <Check size={13} />} Romaji
        </Btn>
        <Btn
          active={showTranslation}
          onClick={() => setShowTranslation((s) => !s)}
        >
          {showTranslation && <Check size={13} />} Translation
        </Btn>
        <div style={{ flex: 1 }} />
        <Btn active={isRead} onClick={() => markChapter(!isRead)}>
          {isRead ? <CheckCircle2 size={14} /> : <Circle size={14} />}{' '}
          {isRead ? 'Read' : 'Mark as read'}
        </Btn>
        <Btn active={chapterPlaying} onClick={playChapter}>
          {chapterPlaying ? <Pause size={14} /> : <Play size={14} />}{' '}
          {chapterPlaying ? 'Stop' : 'Play chapter'}
        </Btn>
        <label
          style={{
            fontSize: 12,
            color: SUB,
            display: 'flex',
            alignItems: 'center',
            gap: 6,
          }}
        >
          Speed{' '}
          <input
            type="range"
            min="0.5"
            max="1.2"
            step="0.05"
            value={rate}
            onChange={(e) => setRate(parseFloat(e.target.value))}
          />
        </label>
        <Btn onClick={() => addAllChapterVocab(currentChapter)}> {/* Pass currentChapter */}
  <Sparkles size={14} /> Add all words
</Btn>
      </div>

      {audioWarning && (
        <div
          style={{
            background: '#F4E2DA',
            color: '#7A3222',
            fontSize: 12.5,
            padding: '8px 20px',
            borderBottom: `1px solid ${LINE}`,
          }}
        >
          Chapter audio didn't start \u2014 some browsers (especially iPhone
          Safari) block automatic playback between verses. Try the small speaker
          icon on an individual verse instead, or use a desktop browser.
        </div>
      )}

      <div
        ref={scrollRef}
        style={{ flex: 1, overflowY: 'auto', padding: '24px 0' }}
      >
        <div style={{ maxWidth: 640, margin: '0 auto', padding: '0 24px' }}>
          {chapterContent.map((verse, i) => {
            const tokens = annotate(verse.jp, verse.overrides);
            return (
              <div
                key={verse.v}
                style={{
                  display: 'flex',
                  gap: 12,
                  padding: '16px 0',
                  borderBottom:
                    i < chapterContent.length - 1 ? `1px solid ${LINE}` : 'none',
                  background: playingIdx === i ? '#F4E6D3' : 'transparent',
                  borderRadius: 8,
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 8,
                    paddingTop: 2,
                  }}
                >
                  <Seal>{verse.v}</Seal>
                  <button
                    onClick={() => playVerse(i)}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: SUB,
                      padding: 2,
                    }}
                  >
                    <Volume2 size={15} />
                  </button>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  {showTranslation && (
                    <div
                      style={{
                        fontSize: 14,
                        color: SUB,
                        fontStyle: 'italic',
                        marginBottom: 6,
                        lineHeight: 1.5,
                      }}
                    >
                      {verse.en}
                    </div>
                  )}
                  <div
                    style={{
                      fontFamily: "'Noto Serif JP', serif",
                      fontSize: 21,
                      lineHeight: 2.3,
                    }}
                  >
                    {tokens.map((tok, ti) => (
                      <RubyToken
                        key={ti}
                        tok={tok}
                        showFurigana={showFurigana}
                        onTap={(t) => setPopup({ ...t, verse: verse.v })}
                      />
                    ))}
                  </div>
                  {showRomaji && (
                    <div
                      style={{ fontSize: 12.5, color: '#A08F70', marginTop: 6 }}
                    >
                      {verseRomaji(tokens)}
                    </div>
                  )}
                </div>
              </div>
            );
          })}

<div style={{ textAlign: 'center', padding: '30px 0 10px 0' }}>
  <div
    style={{
      fontFamily: "'Shippori Mincho', serif",
      color: INDIGO,
      fontSize: 15,
      marginBottom: 14,
    }}
  >
    You've reached the end of Genesis {currentChapter}.
  </div>
  <div
    style={{
      display: 'flex',
      gap: 12,
      justifyContent: 'center',
      flexWrap: 'wrap',
    }}
  >
    <Btn
      onClick={() => {
        scrollRef.current?.scrollTo?.({ top: 0, behavior: 'smooth' });
        showToast('Back to the top — read again!');
      }}
    >
      <RotateCcw size={14} /> Read again
    </Btn>
    <Btn active onClick={() => markChapter(true)}>
      <CheckCircle2 size={14} /> Mark as finished
    </Btn>
    {currentChapter > 1 && ( // Only show if there's a previous chapter
          <Btn
            onClick={() => {
              setCurrentChapter(currentChapter - 1);
              scrollRef.current?.scrollTo?.({ top: 0, behavior: 'smooth' });
            }}
          >
            <ChevronLeft size={14} /> Previous chapter
          </Btn>
        )}
        {CHAPTER_DATA[currentChapter + 1] && ( // Only show if there's a next chapter
          <Btn
            onClick={() => {
              setCurrentChapter(currentChapter + 1);
              scrollRef.current?.scrollTo?.({ top: 0, behavior: 'smooth' });
            }}
          >
            Continue to chapter {currentChapter + 1} <ChevronRight size={14} />
          </Btn>
        )}
  </div>
  {!CHAPTER_DATA[currentChapter + 1] && ( // Only show if there's NO next chapter
    <div style={{ marginTop: 18, fontSize: 12.5, color: SUB }}>
      More chapters &amp;mdash; coming soon.
    </div>
  )}
        </div> {/* This closes the div with textAlign: 'center' (Div 6) */}
      </div> {/* This closes the div with maxWidth: 640 (Div 5) */}
    </div> {/* This closes the div with ref={scrollRef} (Div 4) */}
    </>
  );
}

/* ============================================================
   FLASHCARDS PAGE
   ============================================================ */
function FlashcardsPage({
  reviewDeck,
  currentCard,
  flipped,
  setFlipped,
  onGrade,
  total,
  dueCount,
  todayStats,
  dailyCardGoal,
  dailyMinuteGoal,
  cardGoalInput,
  setCardGoalInput,
  minuteGoalInput,
  setMinuteGoalInput,
  saveDailyGoals,
}) {
  const [showGoals, setShowGoals] = useState(false);
  const highlightExample = (jpText, word) => {
    const idx = jpText.indexOf(word);
    if (idx === -1) return jpText;
    return (
      <>
        {jpText.slice(0, idx)}
        <span style={{ color: VERM, fontWeight: 700 }}>{word}</span>
        {jpText.slice(idx + word.length)}
      </>
    );
  };
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 14,
          padding: '12px 20px',
          borderBottom: `1px solid ${LINE}`,
          flexWrap: 'wrap',
        }}
      >
        <div
          style={{
            fontSize: 12.5,
            color: SUB,
            display: 'flex',
            alignItems: 'center',
            gap: 6,
          }}
        >
          <Target size={13} /> {todayStats.cards}/{dailyCardGoal} cards today
        </div>
        <div
          style={{
            fontSize: 12.5,
            color: SUB,
            display: 'flex',
            alignItems: 'center',
            gap: 6,
          }}
        >
          <Clock size={13} /> {todayStats.minutes}/{dailyMinuteGoal} min today
        </div>
        <div style={{ flex: 1 }} />
        <Btn onClick={() => setShowGoals((s) => !s)}>
          {showGoals ? 'Hide goals' : 'Set daily goal'}
        </Btn>
      </div>
      {showGoals && (
        <div
          style={{
            padding: '14px 20px',
            borderBottom: `1px solid ${LINE}`,
            display: 'flex',
            gap: 24,
            flexWrap: 'wrap',
            alignItems: 'flex-end',
          }}
        >
          <label
            style={{
              fontSize: 13,
              display: 'flex',
              flexDirection: 'column',
              gap: 6,
            }}
          >
            Flashcards per day
            <input
              type="number"
              min={1}
              max={100}
              value={cardGoalInput}
              onChange={(e) =>
                setCardGoalInput(parseInt(e.target.value || '1', 10))
              }
              style={{
                width: 80,
                padding: '6px 8px',
                borderRadius: 6,
                border: '1px solid #DDD0B8',
                background: CARD,
              }}
            />
          </label>
          <label
            style={{
              fontSize: 13,
              display: 'flex',
              flexDirection: 'column',
              gap: 6,
            }}
          >
            Minutes per day
            <input
              type="number"
              min={1}
              max={180}
              value={minuteGoalInput}
              onChange={(e) =>
                setMinuteGoalInput(parseInt(e.target.value || '1', 10))
              }
              style={{
                width: 80,
                padding: '6px 8px',
                borderRadius: 6,
                border: '1px solid #DDD0B8',
                background: CARD,
              }}
            />
          </label>
          <Btn active onClick={saveDailyGoals}>
            Save
          </Btn>
        </div>
      )}

      {total === 0 ? (
        <div
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            gap: 10,
            color: SUB,
          }}
        >
          <Layers size={32} />
          <div style={{ fontSize: 15 }}>No flashcards yet.</div>
          <div style={{ fontSize: 13 }}>
            Tap any underlined word in the Read page to save it here.
          </div>
        </div>
      ) : !currentCard ? (
        <div
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            gap: 10,
            color: SUB,
          }}
        >
          <Check size={32} />
          <div style={{ fontSize: 15 }}>
            All caught up \u2014 nothing due right now.
          </div>
        </div>
      ) : (
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 16,
            padding: 20,
          }}
        >
          <div style={{ fontSize: 13, color: SUB }}>
            {dueCount || reviewDeck.length} card(s) in this session &middot;{' '}
            {total} saved total
          </div>
          <div
            onClick={() => setFlipped((f) => !f)}
            style={{
              width: 340,
              minHeight: 240,
              borderRadius: 18,
              background: CARD,
              border: `1px solid ${LINE}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
              gap: 10,
              cursor: 'pointer',
              boxShadow: '0 8px 30px rgba(0,0,0,0.08)',
              padding: 22,
              textAlign: 'center',
            }}
          >
            {!flipped ? (
              <>
                <div
                  style={{ fontFamily: "'Noto Serif JP', serif", fontSize: 44 }}
                >
                  {currentCard.jp}
                </div>
                <div style={{ fontSize: 13, color: SUB }}>Tap to reveal</div>
              </>
            ) : (
              <>
                <div
                  style={{ fontFamily: "'Noto Serif JP', serif", fontSize: 28 }}
                >
                  {currentCard.jp}
                </div>
                <div style={{ color: VERM, fontSize: 15 }}>
                  {currentCard.reading} &middot; {currentCard.romaji}
                </div>
                <div style={{ fontSize: 17 }}>{currentCard.meaning}</div>
                {currentCard.exVerse && (
                  <div
                    style={{
                      marginTop: 8,
                      paddingTop: 10,
                      borderTop: '1px dashed #E7DCC4',
                      width: '100%',
                    }}
                  >
                    <div
                      style={{
                        fontFamily: "'Noto Serif JP', serif",
                        fontSize: 14,
                        lineHeight: 1.6,
                      }}
                    >
                      {highlightExample(currentCard.exVerse.jp, currentCard.jp)}
                    </div>
                    <div
                      style={{
                        fontSize: 11.5,
                        color: SUB,
                        fontStyle: 'italic',
                        marginTop: 4,
                      }}
                    >
                      {currentCard.exVerse.en}
                    </div>
                    <div style={{ fontSize: 10.5, color: SUB, marginTop: 2 }}>
                      {currentCard.exVerse.ref}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
          {flipped && (
            <div style={{ display: 'flex', gap: 12 }}>
              <button
                onClick={() => onGrade(false)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '9px 18px',
                  borderRadius: 8,
                  border: `1px solid ${VERM}`,
                  color: VERM,
                  background: 'transparent',
                  cursor: 'pointer',
                }}
              >
                <RotateCcw size={14} /> Still learning
              </button>
              <button
                onClick={() => onGrade(true)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '9px 18px',
                  borderRadius: 8,
                  border: `1px solid ${INDIGO}`,
                  color: '#fff',
                  background: INDIGO,
                  cursor: 'pointer',
                }}
              >
                <Check size={14} /> Got it
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ============================================================
   MORE PAGE — dictionary, kanji tips, quiz, matching game
   ============================================================ */
function MorePage({
  weeklyGoal,
  goalInput,
  setGoalInput,
  saveWeeklyGoal,
  reminderTime,
  setReminderTime,
  reminderDays,
  setReminderDays,
  saveReminder,
  disableReminder,
  reminder,
  showToast,
  user,
  onSignOut,
}) {
  const [tab, setTab] = useState('quiz'); // quiz | match | tips | grammar | goals
  const TABS = [
    { id: 'quiz', label: 'Quiz', icon: <GraduationCap size={14} /> },
    { id: 'match', label: 'Word Match', icon: <Shuffle size={14} /> },
    { id: 'tips', label: 'Kanji Tips', icon: <Sparkles size={14} /> },
    { id: 'grammar', label: 'Grammar', icon: <BookMarked size={14} /> },
    { id: 'goals', label: 'Goals & Reminders', icon: <Bell size={14} /> },
  ];
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <div
        style={{
          display: 'flex',
          gap: 8,
          padding: '12px 20px',
          borderBottom: `1px solid ${LINE}`,
          flexWrap: 'wrap',
        }}
      >
        {TABS.map((t) => (
          <Btn key={t.id} active={tab === t.id} onClick={() => setTab(t.id)}>
            {t.icon} {t.label}
          </Btn>
        ))}
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
        <div style={{ maxWidth: 680, margin: '0 auto' }}>
          {tab === 'quiz' && <QuizGame />}
          {tab === 'match' && <MatchGame />}
          {tab === 'tips' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {KANJI_TIPS.map((k) => (
                <div
                  key={k.title}
                  style={{
                    background: CARD,
                    border: `1px solid ${LINE}`,
                    borderRadius: 12,
                    padding: 16,
                  }}
                >
                  <div
                    style={{ fontWeight: 700, color: INDIGO, marginBottom: 6 }}
                  >
                    {k.title}
                  </div>
                  <div
                    style={{
                      fontSize: 13.5,
                      lineHeight: 1.55,
                      marginBottom: 10,
                    }}
                  >
                    {k.body}
                  </div>
                  <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                    {k.examples.map((e) => (
                      <div
                        key={e}
                        style={{
                          background: '#F2E3D8',
                          borderRadius: 8,
                          padding: '6px 10px',
                          textAlign: 'center',
                        }}
                      >
                        <div
                          style={{
                            fontFamily: "'Noto Serif JP', serif",
                            fontSize: 20,
                          }}
                        >
                          {e}
                        </div>
                        <div
                          style={{ fontSize: 10.5, color: VERM, marginTop: 2 }}
                        >
                          {DICT[e] ? convertKana(DICT[e]) : ''}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
          {tab === 'grammar' && (
            <>
              <h3
                style={{
                  fontFamily: "'Shippori Mincho', serif",
                  color: INDIGO,
                  fontSize: 19,
                  marginBottom: 12,
                }}
              >
                Particles
              </h3>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                  gap: 12,
                  marginBottom: 30,
                }}
              >
                {PARTICLES.map((p) => (
                  <div
                    key={p.p}
                    style={{
                      background: CARD,
                      border: `1px solid ${LINE}`,
                      borderRadius: 12,
                      padding: 16,
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'baseline',
                        gap: 8,
                      }}
                    >
                      <span
                        style={{
                          fontFamily: "'Noto Serif JP', serif",
                          fontSize: 24,
                        }}
                      >
                        {p.p}
                      </span>
                      <span style={{ color: VERM, fontSize: 13 }}>
                        {p.reading}
                      </span>
                    </div>
                    <div
                      style={{
                        fontSize: 12.5,
                        color: SUB,
                        marginTop: 2,
                        fontWeight: 600,
                      }}
                    >
                      {p.role}
                    </div>
                    <div
                      style={{ fontSize: 13, marginTop: 8, lineHeight: 1.5 }}
                    >
                      {p.note}
                    </div>
                    {p.example && p.exampleEn && (
                      <div
                        style={{
                          marginTop: 10,
                          paddingTop: 10,
                          borderTop: '1px dashed #E7DCC4',
                        }}
                      >
                        <div
                          style={{
                            fontFamily: "'Noto Serif JP', serif",
                            fontSize: 14,
                          }}
                        >
                          {p.example}
                        </div>
                        <div
                          style={{ fontSize: 11.5, color: VERM, marginTop: 2 }}
                        >
                          {jpRomaji(p.example)}
                        </div>
                        <div
                          style={{
                            fontSize: 11.5,
                            color: SUB,
                            fontStyle: 'italic',
                            marginTop: 2,
                          }}
                        >
                          {p.exampleEn}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <h3
                style={{
                  fontFamily: "'Shippori Mincho', serif",
                  color: INDIGO,
                  fontSize: 19,
                  marginBottom: 12,
                }}
              >
                Grammar notes
              </h3>
              <div
                style={{ display: 'flex', flexDirection: 'column', gap: 12 }}
              >
                {GRAMMAR_NOTES.map((g) => (
                  <div
                    key={g.title}
                    style={{
                      background: CARD,
                      border: `1px solid ${LINE}`,
                      borderRadius: 12,
                      padding: 16,
                    }}
                  >
                    <div
                      style={{ fontWeight: 700, fontSize: 14.5, color: INDIGO }}
                    >
                      {g.title}
                    </div>
                    <div
                      style={{ fontSize: 13, marginTop: 6, lineHeight: 1.55 }}
                    >
                      {g.body}
                    </div>
                    <div style={{ marginTop: 10 }}>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 10,
                          flexWrap: 'wrap',
                        }}
                      >
                        <span
                          style={{
                            fontFamily: "'Noto Serif JP', serif",
                            fontSize: 14,
                          }}
                        >
                          {g.example}
                        </span>
                        <span style={{ fontSize: 11.5, color: SUB }}>
                          ({g.note2})
                        </span>
                      </div>
                      <div
                        style={{ fontSize: 11.5, color: VERM, marginTop: 3 }}
                      >
                        {jpRomaji(g.example)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
          {tab === 'goals' && (
            <>
              <h3
                style={{
                  fontFamily: "'Shippori Mincho', serif",
                  color: INDIGO,
                  fontSize: 19,
                  marginBottom: 12,
                }}
              >
                Weekly reading goal
              </h3>
              <div
                style={{
                  display: 'flex',
                  gap: 10,
                  alignItems: 'center',
                  marginBottom: 30,
                }}
              >
                <span style={{ fontSize: 13 }}>Chapters per week:</span>
                <input
                  type="number"
                  min={1}
                  max={30}
                  value={goalInput}
                  onChange={(e) =>
                    setGoalInput(parseInt(e.target.value || '1', 10))
                  }
                  style={{
                    width: 60,
                    padding: '6px 8px',
                    borderRadius: 6,
                    border: '1px solid #DDD0B8',
                    background: CARD,
                  }}
                />
                <Btn active onClick={saveWeeklyGoal}>
                  Save
                </Btn>
              </div>
              <h3
                style={{
                  fontFamily: "'Shippori Mincho', serif",
                  color: INDIGO,
                  fontSize: 19,
                  marginBottom: 12,
                }}
              >
                <Bell
                  size={15}
                  style={{ verticalAlign: '-2px', marginRight: 6 }}
                />
                Reading reminder
              </h3>
              <div
                style={{
                  display: 'flex',
                  gap: 10,
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  marginBottom: 10,
                }}
              >
                <input
                  type="time"
                  value={reminderTime}
                  onChange={(e) => setReminderTime(e.target.value)}
                  style={{
                    padding: '6px 8px',
                    borderRadius: 6,
                    border: '1px solid #DDD0B8',
                    background: CARD,
                  }}
                />
                {DAY_NAMES.map((d, di) => (
                  <Btn
                    key={d}
                    active={reminderDays.includes(di)}
                    onClick={() =>
                      setReminderDays((days) =>
                        days.includes(di)
                          ? days.filter((x) => x !== di)
                          : [...days, di]
                      )
                    }
                    style={{ padding: '5px 9px', fontSize: 11.5 }}
                  >
                    {d}
                  </Btn>
                ))}
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <Btn active onClick={saveReminder}>
                  Set reminder
                </Btn>
                {reminder?.enabled && (
                  <Btn onClick={disableReminder}>Turn off</Btn>
                )}
              </div>
              <div
                style={{
                  fontSize: 12,
                  color: SUB,
                  marginTop: 10,
                  maxWidth: 480,
                  lineHeight: 1.5,
                }}
              >
                Reminders only fire while this app is open in a browser tab
                \u2014 there's no background notification service here.
                {reminder?.enabled && (
                  <>
                    <br />
                    Currently set for {reminder.time}, on{' '}
                    {reminder.days.map((d) => DAY_NAMES[d]).join(', ')}.
                  </>
                )}
              </div>
            </>
          )}
          {tab === 'goals' && user && (
            <div
              style={{
                marginTop: 20,
                paddingTop: 20,
                borderTop: `1px solid ${LINE}`,
              }}
            >
              <h3
                style={{
                  fontFamily: "'Shippori Mincho', serif",
                  color: INDIGO,
                  fontSize: 19,
                  marginBottom: 12,
                }}
              >
                Account
              </h3>
              <div
                style={{
                  fontSize: 13.5,
                  color: SUB,
                  marginBottom: 12,
                }}
              >
                Signed in as <b>{user.displayName || user.email}</b>
              </div>
              <Btn onClick={onSignOut}>Sign out</Btn>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ---------- Quiz game ---------- */
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
function buildQuiz(n = 8) {
  const pool = shuffle(VOCAB_BANK).slice(0, n);
  return pool.map((word) => {
    const distractors = shuffle(VOCAB_BANK.filter((w) => w.jp !== word.jp))
      .slice(0, 3)
      .map((w) => w.meaning);
    return {
      jp: word.jp,
      reading: word.reading,
      correct: word.meaning,
      options: shuffle([word.meaning, ...distractors]),
    };
  });
}
function QuizGame() {
  const [questions, setQuestions] = useState(() => buildQuiz());
  const [i, setI] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState(null);
  const [done, setDone] = useState(false);
  const restart = () => {
    setQuestions(buildQuiz());
    setI(0);
    setScore(0);
    setSelected(null);
    setDone(false);
  };
  const q = questions[i];
  const choose = (opt) => {
    if (selected) return;
    setSelected(opt);
    const correct = opt === q.correct;
    if (correct) setScore((s) => s + 1);
    setTimeout(() => {
      if (i + 1 >= questions.length) setDone(true);
      else {
        setI((n) => n + 1);
        setSelected(null);
      }
    }, 700);
  };
  if (done) {
    return (
      <div style={{ textAlign: 'center', padding: '40px 0' }}>
        <div
          style={{
            fontSize: 22,
            fontWeight: 700,
            color: INDIGO,
            marginBottom: 8,
          }}
        >
          Score: {score} / {questions.length}
        </div>
        <div style={{ fontSize: 13, color: SUB, marginBottom: 20 }}>
          {score === questions.length
            ? 'Perfect! \u2728'
            : 'Nice work \u2014 keep practicing.'}
        </div>
        <Btn active onClick={restart}>
          Play again
        </Btn>
      </div>
    );
  }
  return (
    <div>
      <div style={{ fontSize: 12.5, color: SUB, marginBottom: 14 }}>
        Question {i + 1} of {questions.length} &middot; Score {score}
      </div>
      <div
        style={{
          background: CARD,
          border: `1px solid ${LINE}`,
          borderRadius: 14,
          padding: 26,
          textAlign: 'center',
          marginBottom: 16,
        }}
      >
        <div style={{ fontFamily: "'Noto Serif JP', serif", fontSize: 48 }}>
          {q.jp}
        </div>
        <div style={{ color: VERM, fontSize: 14, marginTop: 6 }}>
          {q.reading} &middot; {convertKana(q.reading)}
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        {q.options.map((opt) => {
          let bg = CARD,
            border = LINE,
            color = INK;
          if (selected) {
            if (opt === q.correct) {
              bg = '#DCEFE1';
              border = '#3C7A4E';
              color = '#22512F';
            } else if (opt === selected) {
              bg = '#F4DAD4';
              border = VERM;
              color = '#7A3222';
            }
          }
          return (
            <button
              key={opt}
              onClick={() => choose(opt)}
              style={{
                padding: '14px 12px',
                borderRadius: 10,
                border: `1px solid ${border}`,
                background: bg,
                color,
                cursor: selected ? 'default' : 'pointer',
                fontSize: 14,
                fontFamily: "'Source Serif 4', Georgia, serif",
              }}
            >
              {opt}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ---------- Word match game ---------- */
function buildMatch(n = 6) {
  const words = shuffle(VOCAB_BANK).slice(0, n);
  const left = shuffle(
    words.map((w) => ({ id: `k-${w.jp}`, key: w.jp, display: w.jp }))
  );
  const right = shuffle(
    words.map((w) => ({ id: `m-${w.jp}`, key: w.jp, display: w.meaning }))
  );
  return { left, right };
}
function MatchGame() {
  const [{ left, right }, setBoard] = useState(() => buildMatch());
  const [selLeft, setSelLeft] = useState(null);
  const [selRight, setSelRight] = useState(null);
  const [solved, setSolved] = useState(new Set());
  const [wrong, setWrong] = useState(null);
  const restart = () => {
    setBoard(buildMatch());
    setSelLeft(null);
    setSelRight(null);
    setSolved(new Set());
    setWrong(null);
  };

  useEffect(() => {
    if (selLeft && selRight) {
      if (selLeft.key === selRight.key) {
        setSolved((s) => new Set([...s, selLeft.key]));
        setSelLeft(null);
        setSelRight(null);
      } else {
        setWrong(true);
        setTimeout(() => {
          setSelLeft(null);
          setSelRight(null);
          setWrong(false);
        }, 600);
      }
    }
  }, [selLeft, selRight]);

  const allSolved = solved.size === left.length;
  const tileStyle = (item, isSelected) => ({
    padding: '14px 10px',
    borderRadius: 10,
    border: `1px solid ${
      solved.has(item.key)
        ? '#3C7A4E'
        : isSelected
        ? wrong
          ? VERM
          : INDIGO
        : LINE
    }`,
    background: solved.has(item.key)
      ? '#DCEFE1'
      : isSelected
      ? '#F2E3D8'
      : CARD,
    color: solved.has(item.key) ? '#22512F' : INK,
    cursor: solved.has(item.key) ? 'default' : 'pointer',
    textAlign: 'center',
    fontFamily: item.id.startsWith('k-')
      ? "'Noto Serif JP', serif"
      : "'Source Serif 4', Georgia, serif",
    fontSize: item.id.startsWith('k-') ? 22 : 13.5,
    transition: 'all 0.15s',
  });
  return (
    <div>
      <div style={{ fontSize: 12.5, color: SUB, marginBottom: 14 }}>
        Match each kanji to its meaning. {solved.size}/{left.length} solved.
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {left.map((item) => (
            <div
              key={item.id}
              onClick={() => !solved.has(item.key) && setSelLeft(item)}
              style={tileStyle(item, selLeft?.id === item.id)}
            >
              {item.display}
              <div
                style={{
                  fontFamily: "'Source Serif 4', Georgia, serif",
                  fontSize: 10.5,
                  color: solved.has(item.key) ? '#22512F' : VERM,
                  marginTop: 2,
                }}
              >
                {DICT[item.key] ? convertKana(DICT[item.key]) : ''}
              </div>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {right.map((item) => (
            <div
              key={item.id}
              onClick={() => !solved.has(item.key) && setSelRight(item)}
              style={tileStyle(item, selRight?.id === item.id)}
            >
              {item.display}
            </div>
          ))}
        </div>
      </div>
      {allSolved && (
        <div style={{ textAlign: 'center', marginTop: 20 }}>
          <div
            style={{
              fontSize: 16,
              fontWeight: 700,
              color: '#3C7A4E',
              marginBottom: 10,
            }}
          >
            All matched! \u2728
          </div>
          <Btn active onClick={restart}>
            Play again
          </Btn>
        </div>
      )}
    </div>
  );
}
