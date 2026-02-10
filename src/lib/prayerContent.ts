export interface PrayerContent {
  type: 'text' | 'links' | 'modal-links';
  english?: string;
  malayalam?: string;
  links?: {
    english?: string;
    malayalam?: string;
  };
}

export const prayerContents: Record<string, PrayerContent> = {
  'Holy Mass': {
    type: 'text',
    // No modal needed for Holy Mass
  },
  'Rosary': {
    type: 'modal-links',
    links: {
      malayalam: 'https://nelsonmcbs.com/2019/10/22/holy-rosary-malayalam-japamala-kontha/',
      english: 'https://visitationproject.org/collections/the-holy-rosary?gad_source=1&gad_campaignid=19447163915&gbraid=0AAAAACN5-w3OLG97gcF4PkqCv25iE-XJn&gclid=Cj0KCQiA-YvMBhDtARIsAHZuUzLzYNLnjUlXRLOd18Xxu22nVNGGUB5CNLVllj19HUHfwROg9YvMQ-UaAl9wEALw_wcB',
    },
  },
  'Memorare': {
    type: 'text',
    malayalam: `എത്രയും ദയയുള്ള മാതാവേ ,അങ്ങേ സങ്കേതത്തില്‍ ,ഓടിവന്ന്,അങ്ങേ സഹായം തേടി ,അങ്ങേ മാദ്ധ്യസ്ഥം  അപേക്ഷിച്ചവരില്‍ ഒരുവനെയെങ്കിലും അങ്ങ് ഉപേക്ഷിച്ചതായി ലോകത്തില്‍ കേട്ടിട്ടില്ല എന്ന് ഓര്‍ക്കണമേ. കന്യാവ്രതക്കാരുടെ രാജ്ഞീ  ,ദയയുള്ള മാതാവേ ,ഈ വിശ്വാസത്തില്‍ ശരന്നപ്പെട്ട്,അങ്ങേ തൃപാദത്തിങ്കൽ  ഞാന്‍ അണയുന്നു .നെടുവീര്‍പ്പോടും കണ്ണുനീരോടും കൂടെ പാപിയായ ഞാന്‍ അങ്ങേ ദയാധിക്യത്തെ പ്രതീക്ഷിച്ചുകൊണ്ട്  അങ്ങേ സന്നിധിയില്‍ നില്‍ക്കുന്നു .അവതരിച്ച വചനത്തിന്‍ മാതാവേ ,എന്‍റെ അപേക്ഷ ഉപേക്ഷിക്കാതെ ദയാപൂര്‍വ്വം കേട്ടരുളേണമേ  ആമ്മേന്‍ ..`,
    english: `Remember, O most gracious Virgin Mary,
that never was it known 
that anyone who fled to thy protection, 
implored thy help, 
or sought thy intercession, 
was left unaided. 
Inspired by this confidence 
I fly unto thee, 
O Virgin of virgins, my Mother. 
To thee do I come, 
before thee I stand, 
sinful and sorrowful. 
O Mother of the Word Incarnate,
despise not my petitions, 
but in thy mercy hear and answer me. 
Amen.`,
  },
  'Creed': {
    type: 'text',
    malayalam: `സര്‍വ്വശക്തനായ പിതാവും ആകാശത്തിന്‍റെയും ഭൂമിയുടെയും സ്രഷ്ടാവുമായ ദൈവത്തില്‍ ഞാന്‍ വിശ്വസിക്കുന്നു .അവിടുത്തെ ഏകപുത്രനും ഞങ്ങളുടെ കര്‍ത്താവുമായ  ഈശോമിശിഹായിലും ഞാന്‍ വിശ്വസിക്കുന്നു .ഈ പുത്രന്‍ പരിശുദ്ധാത്മാവാല്‍ ഗര്‍ഭസ്ഥനായി  കന്യാമറിയത്തില്‍ നിന്നു പിറന്നു .പന്തിയോസ് പീലാത്തോസിന്‍റെ കാലത്ത്  പീഡകള്‍ സഹിച്ച്  ,കുരിശില്‍ തറയ്ക്കപ്പെട്ട്  ,മരിച്ച് അടക്കപ്പെട്ടു ;പാതാളത്തില്‍ ഇറങ്ങി ,മരിച്ചവരുടെ ഇടയില്‍നിന്നു മൂന്നാം നാള്‍ ഉയിര്‍ത്തു ;സ്വര്‍ഗ്ഗത്തിലെക്കെഴുന്നള്ളി ,സര്‍വ്വശക്തിയുള്ള പിതാവായ ദൈവത്തിന്‍റെ വലതു ഭാഗത്ത് ഇരിക്കുന്നു ;അവിടെനിന്ന്  ജീവിക്കുന്നവരെയും മരിച്ചവരെയും വിധിക്കാന്‍ വരുമെന്നും ഞാന്‍ വിശ്വസിക്കുന്നു .പരിശുദ്ധാത്മാവിലും ഞാന്‍ വിശ്വസിക്കുന്നു .വിശുദ്ധ കത്തോലിക്കാ സഭയിലും ,പുണ്യവാന്മാരുടെ ഐക്യത്തിലും ,പാപങ്ങളുടെ മോചനത്തിലും ,ശരീരത്തിന്‍റെ ഉയിര്‍പ്പിലും നിത്യമായ ജീവതത്തിലും ഞാന്‍ വിശ്വസിക്കുന്നു .  ആമ്മേന്‍ .`,
    english: `I believe in God,
the Father almighty,
Creator of heaven and earth,
and in Jesus Christ, his only Son, our Lord,
who was conceived by the Holy Spirit,
born of the Virgin Mary,
suffered under Pontius Pilate,
was crucified, died and was buried;
he descended into hell;
on the third day he rose again from the dead;
he ascended into heaven,
and is seated at the right hand of God the Father almighty;
from there he will come to judge the living and the dead.

I believe in the Holy Spirit,
the holy catholic Church,
the communion of saints,
the forgiveness of sins,
the resurrection of the body,
and life everlasting.

Amen.`,
  },
  'Hail Mary': {
    type: 'text',
    english: `Hail, Mary, full of grace,
the Lord is with thee.
Blessed art thou amongst women
and blessed is the fruit of thy womb, Jesus.
Holy Mary, Mother of God,
pray for us sinners,
now and at the hour of our death. 
Amen.`,
    malayalam: `നന്മനിറഞ്ഞ മറിയമേ,സ്വസ്തി .കര്‍ത്താവ് അങ്ങയോടുകൂടെ സ്ത്രീകളില്‍ അങ്ങ്  അനുഗ്രഹിക്കപ്പെട്ടവള്‍ ആകുന്നു അങ്ങയുടെ ഉദരത്തില്‍ ഫലമായ ഈശോ അനുഗ്രഹിക്കപ്പെട്ടവനാകുന്നു
പരിശുദ്ധ മറിയമേ ,തബുരാൻ്റെ    അമ്മേ ,പാപികളായ ഞങ്ങള്‍ ക്കുവേണ്ടി  ഇപ്പോഴും ഞങളുടെ മരണ സമയത്തും തമ്പുരാനോട് അപേക്ഷിക്കണമേ .                                    
ആമ്മേന്‍ .`,
  },
  'Way of the Cross': {
    type: 'modal-links',
    links: {
      english: 'https://lordcalls.com/dailyprayer/the-way-of-the-cross-the-stations-of-the-cross',
      malayalam: 'https://malankaralibrary.com/ImageUpload/051a1217ed02130829cd34181e87b98f.pdf',
    },
  },
  'Novena of St. Joseph': {
    type: 'links',
    links: {
      english: 'https://nelsonmcbs.com/2021/01/20/novene-to-st-joseph/',
    },
  },
  'Adoration': {
    type: 'links',
    links: {
      english: 'https://www.youtube.com/watch?v=qz8YE61BoXM',
    },
  },
  'Word of God': {
    type: 'links',
    links: {
      english: 'https://thiruvachanam.in/',
    },
  },
  'Breakfast': {
    type: 'text',
    // No modal needed for fasting
  },
  'Lunch': {
    type: 'text',
    // No modal needed for fasting
  },
  'Tea & Snacks': {
    type: 'text',
    // No modal needed for fasting
  },
  'Dinner': {
    type: 'text',
    // No modal needed for fasting
  },
  'Prayer to St. Michael': {
    type: 'text',
    malayalam: `മുഖ്യദൂതനായ വി.മിഖായേലേ,സ്വർഗ്ഗീയ സൈന്യങ്ങളുടെ പ്രതാപനായ പ്രഭോ,ഉന്നത ശക്തികളോടും,അധികാരങ്ങളോടും ഇരുളടഞ്ഞ ഈ ലോകത്തിലെ ഭരണകർത്താക്കളോടും ഉപരിതലങ്ങളില്ലെ ദുരാത്മാക്കളോടുമുള്ള യുദ്ധത്തിൽ ഞങ്ങളെ സഹായിക്കണമേ.

ദൈവം സ്വന്തം ഛായായിൽ സൃഷ്ഠിക്കുകയും വലിയ വില കൊടുത്ത് വീണ്ടെടുക്കുകയും ചെയ്ത മനുഷ്യരെ പിശാചിന്റെ ക്രൂരഭരണത്തിൽ നിന്നും രക്ഷിക്കുവാൻ വരേണമേ.അങ്ങയെയാണല്ലോ തിരുസഭ തന്റെ പരിപാലകനും സംരക്ഷകനുമായി സ്നേഹിക്കുന്നത്.കർത്താവ്‌ രക്ഷിച്ച ആത്മാക്കളെ സ്വർഗ്ഗത്തിലേക്ക് കൂട്ടികൊണ്ടുപോകുവാൻ നിയുക്തനായിരിക്കുന്നത് അങ്ങ് തന്നെയാണല്ലോ.

ആകയാൽ ഞങ്ങളുടെ പാദങ്ങളുടെ കീഴിൽ പിശാചിനെ അടിമപ്പെടുത്തുവാൻ സമാധാനദാതാവയ ദൈവത്തോട് പ്രാർത്ഥിക്കണമേ.അവൻ ഒരിക്കലും മനുഷ്യരെ കീഴ്പെടുത്തുകയോ തിരുസഭയെ ഉപദ്രവിക്കുകയോ ചെയ്യാതിരിക്കട്ടെ.

കർത്താവിന്റെ കരുണ വേഗം ഞങ്ങളുടെമേൽ ഉണ്ടാകുന്നതിനായി ഞങ്ങളുടെ യാചനകൾ അത്യുന്നതന്റെ മുമ്പിൽ സമർപ്പിക്കണമേ.ദുഷ്ടജന്തുവും പഴയ സർപ്പവുമായ സാത്താനെയും അവന്റെ കൂട്ടുകാരെയും പിടിച്ചുകെട്ടി പാതാളത്തിൽ തള്ളി താഴ്ത്തണമേ .അവൻ മേലൊരിക്കലും ജനങ്ങളെ വഴി തെറ്റിക്കാതിരിക്കട്ടെ.ആമ്മേൻ`,
    english: `Saint Michael the Archangel, defend us in battle. Be our protection against the wickedness and snares of the devil; May God rebuke him, we humbly pray; And do thou, O Prince of the Heavenly Host, by the power of God, thrust into hell Satan and all evil spirits who wander through the world for the ruin of souls. Amen.`,
  },
};
