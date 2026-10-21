/* ---------- sample helpers ---------- */
const P = (html, label = '', cls = '') => `<div class="sheet"><div class="smp ${cls}">${html}</div></div>${label ? `<div class="slab">${label}</div>` : ''}`;
const B = (s, x = '') => `<b>${s}</b>${x ? ' · ' + x : ''}`;
const dial = (l, r, pos, html, label = '') => `<div class="dial"><div class="dial-t"><span class="${pos < 50 ? 'on' : ''}">${l}</span><span class="${pos > 50 ? 'on' : ''}">${r}</span></div><div class="dial-r"><i style="left:${pos}%"></i></div></div>${P(html, label)}`;
const toast = (t, u = '') => `<div class="m m-toast"><span>${t}</span>${u ? `<span class="u">${u}</span>` : ''}</div>`;
const dlg = (h, b, btns) => `<div class="m m-card"><div class="m-h">${h}</div><div class="m-b">${b}</div><div class="m-btns">${btns.map(([t, c]) => `<span class="m-btn ${c || ''}">${t}</span>`).join('')}</div></div>`;
const field = (l, v, e, h = '') => `<div class="m m-card" style="gap:5px"><div class="m-lbl">${l}</div><div class="m-in">${v}</div>${e ? `<div class="m-err">${e}</div>` : ''}${h ? `<div class="m-hint">${h}</div>` : ''}</div>`;
const push = (app, t, b, time = 'now') => `<div class="m m-push"><span class="ic"></span><div class="t">${t}<small>${app} · ${time}</small></div><div class="b">${b}</div></div>`;
const mono = (html, label = '') => `<div class="m-mono">${html}</div>${label ? `<div class="slab">${label}</div>` : ''}`;
const mail = (from, subj, html) => `<div class="m m-card m-mail"><div class="hd">From <b>${from}</b><br>Subject <b>${subj}</b></div><div class="smp" style="font-size:14px">${html}</div></div>`;
const post = (n, h, html) => `<div class="m m-card"><div class="m-post"><span class="av"></span><div><div class="n">${n} <small>${h}</small></div><div class="smp" style="font-size:14px;margin-top:3px">${html}</div></div></div></div>`;
const hero = (h, s, btns = []) => `<div class="m m-card m-hero"><div class="h">${h}</div><div class="s">${s}</div>${btns.length ? `<div class="m-row">${btns.map(([t, c]) => `<span class="m-btn ${c || ''}">${t}</span>`).join('')}</div>` : ''}</div>`;
const FERRY = B('Brief', 'ferry cancelled tonight, fog');
const THEATER = B('Brief', 'the old movie theater is closing');
const PHONE = B('Brief', 'ask people to silence their phones');
const LANES = B('Brief', 'the town is adding bike lanes');
const DINER = B('Brief', 'a stranger walks into a diner at night');

/* ---------- workbook content ----------
   Each section is a group pushed into pool.groups:
   { id, title, slot, intro, terms:[{ id, name, aka, desc, hear?, not?, ref, prompt, ex }] }
   Voice cards all carry the same brief (a ferry cancelled by fog), so you can compare them.
*/
const pool = { groups: [] };

/* ===== Voices ===== */
pool.groups.push({
  id: 'everyday', title: 'Everyday voices', slot: 'Voice',
  intro: 'The voices most brands, apps and newsletters pick from. Every card here carries the same message (tonight\'s ferry is cancelled because of fog) so you can hear the difference.',
  terms: [
    { id: 'plain', name: 'Plainspoken', aka: 'plain, straightforward, no-nonsense',
      desc: 'Says what happened and what to do, in the order you need it, with ordinary words. No warm-up, no jokes, no adjectives doing work the facts could do. The safest voice there is, and rarely the wrong one.',
      hear: 'short sentences, verbs up front, numbers instead of adjectives',
      not: 'plain, not curt',
      ref: 'GOV.UK style guide, plain language movement, Orwell\'s "Politics and the English Language"',
      prompt: 'a plainspoken voice: short sentences, everyday words, the key fact first and the action second, nothing decorative',
      ex: P(`Tonight's 9:40 ferry is cancelled because of fog. The next one leaves at 7:00 tomorrow. Your ticket will be refunded automatically.`, FERRY) },
    { id: 'warm', name: 'Warm & friendly', aka: 'friendly, approachable, human',
      desc: 'Talks like a person who likes you: contractions, "we" and "you", a small kindness for the inconvenience. Still gets to the point, but takes a breath to acknowledge how it lands.',
      hear: 'you and we, contractions, one line of empathy before the facts',
      not: 'warm, not gushing',
      ref: 'Mailchimp\'s content style guide, Headspace, Airbnb host messages',
      prompt: 'a warm, friendly voice: contractions, "you" and "we", one short line that acknowledges how the reader feels, then the facts',
      ex: P(`We're sorry, the fog rolled in and tonight's 9:40 ferry can't sail. The first boat tomorrow leaves at 7:00, and we've already refunded your ticket. Stay warm out there.`, FERRY) },
    { id: 'witty', name: 'Witty', aka: 'clever, dry humor, light touch',
      desc: 'One well-placed joke that comes out of the situation itself, never a pun bolted on. The information is complete; the wit is a garnish, and it stays out of anything painful.',
      hear: 'one twist per message, built from the actual facts',
      not: 'witty, not snarky',
      ref: 'Innocent Drinks packaging, Monzo app copy, The Economist\'s headlines',
      prompt: 'a witty voice: one light joke that comes from the situation, never at the reader\'s expense; all the facts still there',
      ex: P(`The fog has won tonight. The 9:40 ferry is cancelled, the 7:00 tomorrow is very much on, and your refund is already on its way, which is more than we can say for the boat.`, FERRY) },
    { id: 'authoritative', name: 'Authoritative', aka: 'expert, assured, institutional',
      desc: 'Sounds like the people who know. Calm, precise and complete, with reasons given briefly. No hedging, no chumminess; trust comes from accuracy.',
      hear: 'precise terms, a reason for each decision, no softeners like "just" or "maybe"',
      not: 'authoritative, not pompous',
      ref: 'Mayo Clinic, the BBC, National Weather Service bulletins',
      prompt: 'an authoritative, expert voice: precise, calm, complete, with a brief reason for each decision and no hedging',
      ex: P(`Visibility in the channel is below 200 metres, under the minimum for safe passage. The 21:40 sailing is cancelled. Service resumes at 07:00. Refunds are issued automatically to the original payment method.`, FERRY) },
    { id: 'earnest', name: 'Earnest', aka: 'sincere, heartfelt, mission-driven',
      desc: 'Means every word and isn\'t embarrassed about it. Speaks to values and to the reader directly, with no irony. Powerful for nonprofits and founders\' letters; cloying if every sentence does it.',
      hear: 'values words (care, safety, together), no jokes, direct address',
      not: 'earnest, not preachy',
      ref: 'Patagonia, Wikipedia fundraising banners, founders\' letters',
      prompt: 'an earnest, sincere voice: no irony, speaks plainly about why it matters and what we owe the reader',
      ex: P(`We won't sail in fog. Your safety matters more to us than a schedule, so tonight's 9:40 crossing is cancelled. We'll be ready at 7:00 tomorrow, and your fare has already been returned.`, FERRY) },
    { id: 'playful', name: 'Playful', aka: 'cheeky, fun, lighthearted',
      desc: 'Bouncier than witty: exclamation points allowed, a little personification, the sense the writer is enjoying themselves. Great for consumer apps and kids; wrong for anything with stakes.',
      hear: 'personified objects, exclamation points, a wink in every line',
      not: 'playful, not childish',
      ref: 'Duolingo, Slack\'s early copy, Mailchimp\'s Freddie',
      prompt: 'a playful voice: light, bouncy, a little personification and the odd exclamation point, never at the expense of clarity',
      ex: P(`Our ferry is staying tucked in tonight. Too foggy to see its own nose! The 9:40 is off, the 7:00 tomorrow is on, and your refund has already set sail.`, FERRY) },
    { id: 'reassuring', name: 'Reassuring', aka: 'calming, steady, caring',
      desc: 'Leads with the thing the reader is worried about and settles it. Steady rhythm, nothing alarming in the wording, a clear next step. The voice for health, money and anything that went wrong.',
      hear: 'answers "am I okay?" first, then the details',
      not: 'reassuring, not patronizing',
      ref: 'NHS patient letters, Wise and Monzo support messages',
      prompt: 'a reassuring voice: answer the reader\'s worry first, steady calm wording, then one clear next step',
      ex: P(`You don't need to do anything. Tonight's 9:40 ferry is cancelled because of fog, your ticket has been refunded, and there's a seat for you on the 7:00 tomorrow if you'd like it.`, FERRY) },
    { id: 'confident', name: 'Confident', aka: 'bold, decisive, punchy',
      desc: 'Short, declarative, and unbothered. States decisions instead of explaining them at length. Feels modern and capable; tipped too far it reads as arrogant.',
      hear: 'fragments allowed, no qualifiers, active verbs',
      not: 'confident, not cocky',
      ref: 'Nike, Apple product pages, Stripe\'s homepage',
      prompt: 'a confident voice: short declarative sentences, decisions stated plainly, no qualifiers or apologies',
      ex: P(`Fog's in. Tonight's 9:40 doesn't sail. Tomorrow's 7:00 does. Refund's done.`, FERRY, 'lg') },
    { id: 'curious', name: 'Curious', aka: 'inquisitive, enthusiastic explainer, nerdy',
      desc: 'Finds the situation interesting and brings you along. Adds the one fact that makes you go "huh". Good for science, education and brands that want to seem smart without lecturing.',
      hear: 'a "here\'s why" aside, a surprising fact, questions',
      not: 'curious, not rambling',
      ref: 'Radiolab, Kurzgesagt, Atlas Obscura, Mental Floss',
      prompt: 'a curious voice: interested in how things work, includes one surprising fact or "here\'s why", invites the reader in',
      ex: P(`Sea fog forms when warm air slides over cold water, and tonight the channel is full of it. So the 9:40 ferry is cancelled. The 7:00 tomorrow should sail once the sun burns it off. Your refund is done.`, FERRY) },
    { id: 'minimal', name: 'Minimalist', aka: 'terse, spare, telegraphic',
      desc: 'The fewest words that still work. Often fragments, often lists. Respectful of attention; the voice of good signage, status pages and notification text.',
      hear: 'no articles, no pleasantries, everything scannable',
      not: 'minimal, not cold',
      ref: 'airport signage, status pages, Dieter Rams-era Braun manuals',
      prompt: 'a minimalist, telegraphic voice: as few words as possible, fragments and lists, no pleasantries',
      ex: P(`9:40 ferry cancelled (fog).<br>Next: 7:00 tomorrow.<br>Refund: automatic.`, FERRY, 'lg') },
    { id: 'exuberant', name: 'Exuberant', aka: 'high-energy, hype, enthusiastic',
      desc: 'Maximum enthusiasm, capital letters, the feeling of a friend who can\'t wait to tell you. Wonderful for launches and wins. Exhausting for anything else, and badly wrong for bad news.',
      hear: 'superlatives, exclamation points, emojis allowed',
      not: 'excited, not shouting',
      ref: 'launch-day tweets, Liquid Death, sports radio',
      prompt: 'an exuberant, high-energy voice: big enthusiasm, short bursts, exclamation points; save it for good news',
      ex: P(`OK, the fog is UNREAL tonight, so the 9:40 is staying put! Good news: the 7:00 tomorrow is a go, and your refund already landed!`, FERRY) },
    { id: 'wry', name: 'Wry', aka: 'dry, sardonic-lite, knowing',
      desc: 'Quietly amused at the world, including itself. Understates instead of joking, and lets the reader notice the funny part. The New Yorker\'s default register; gentler than sarcasm.',
      hear: 'understatement, a raised eyebrow you can hear, no exclamation points',
      not: 'wry, not bitter',
      ref: 'The New Yorker Talk of the Town, Nora Ephron, David Sedaris',
      prompt: 'a wry voice: dry, quietly amused, understatement over jokes, lets the reader find the funny part',
      ex: P(`The channel has decided it would rather be a cloud tonight, so the 9:40 won't be leaving. The 7:00 tomorrow is, for now, undaunted. Your refund has gone through without incident.`, FERRY) }
  ]
});

pool.groups.push({
  id: 'character', title: 'Character voices', slot: 'Voice',
  intro: 'Voices with a personality big enough to be a narrator. Use them for fiction, liner notes, games, newsletters with a persona, or one bold page. The ferry is still cancelled.',
  terms: [
    { id: 'deadpan', name: 'Deadpan', aka: 'straight-faced, flat affect',
      desc: 'Reports absurd or dramatic things in a completely flat tone, and the flatness is the joke. Never signals that it knows it\'s funny.',
      hear: 'level sentences, no adjectives of feeling, the strange detail stated as routine',
      not: 'deadpan, not bored',
      ref: 'Steven Wright, Wes Anderson narration, Welcome to Night Vale, Aki Kaurismäki',
      prompt: 'a deadpan voice: flat, matter-of-fact delivery of strange details, never acknowledging the joke',
      ex: P(`The ferry will not run tonight. There is fog. A man on the pier asked if he could swim it. We said no. The next ferry is at 7:00. Refunds have been issued.`, FERRY) },
    { id: 'irreverent', name: 'Irreverent', aka: 'cheeky, rule-breaking, punk',
      desc: 'Treats the usual politeness as optional and pokes at the institution it speaks for. Swearing optional. Builds intense loyalty with the right audience and alienates everyone else.',
      hear: 'self-mockery, slang, rules of corporate tone visibly ignored',
      not: 'irreverent, not mean',
      ref: 'Liquid Death, Oatly packaging, Cards Against Humanity, Wendy\'s on Twitter',
      prompt: 'an irreverent voice: cheeky, breaks corporate politeness, pokes fun at itself and the situation, never at the reader',
      ex: P(`Look, we're a ferry company, not a submarine company. Can't see a thing out there. 9:40 is cancelled, 7:00 tomorrow is on, money's back in your account. Go get a chowder.`, FERRY) },
    { id: 'hardboiled', name: 'Hard-boiled', aka: 'noir, pulp detective, Chandler-esque',
      desc: 'Clipped, world-weary first person with ornate similes about rain, dames and bad coffee. Instantly recognizable and easy to overdo; one simile per paragraph is plenty.',
      hear: 'tough-guy first person, wisecracking similes, short paragraphs',
      not: 'noir, not parody',
      ref: 'Raymond Chandler, Dashiell Hammett, Blade Runner\'s voiceover, Max Payne',
      prompt: 'a hard-boiled noir voice: clipped first-person, world-weary, one sharp simile per paragraph',
      ex: P(`The fog came in like a debt collector, slow and sure of itself. Nobody was crossing tonight. The 9:40 was dead on the pier. The 7:00 might make it, if the sea felt generous. Your money? Already back where it came from.`, FERRY) },
    { id: 'lyrical', name: 'Lyrical', aka: 'poetic, musical, evocative',
      desc: 'Writes for the ear: rhythm, imagery and sound matter as much as meaning. Sentences linger. Lovely for brand stories, album copy and openings; slow for anything urgent.',
      hear: 'images instead of facts, long rolling sentences, sound patterns',
      not: 'lyrical, not purple',
      ref: 'Mary Oliver, Annie Dillard, Terrence Malick voiceovers, Lord Huron liner notes',
      prompt: 'a lyrical voice: musical rhythm, concrete images, sentences that linger, but the facts still land',
      ex: P(`The fog came down off the hills at dusk and swallowed the harbor whole, and the 9:40 will sleep at its moorings tonight. In the morning, at seven, when the light comes back, she'll carry you across. Your fare has gone home ahead of you.`, FERRY) },
    { id: 'campfire', name: 'Campfire storyteller', aka: 'tall tale, folk narrator, yarn-spinner',
      desc: 'A spoken voice that leans in: "now," "folks say," "I\'ll tell you." Builds a little legend around plain events. Perfect for folk and Americana, outdoor brands and anything meant to be read aloud.',
      hear: 'direct address, spoken asides, a rumor or legend woven in',
      not: 'folksy, not hokey',
      ref: 'Garrison Keillor, Mark Twain, Lord Huron\'s Whispering Pines lore, the Moth',
      prompt: 'a campfire storyteller voice: spoken, leaning in, direct address and folksy asides, turning plain events into a little legend',
      ex: P(`Now, the old-timers will tell you the fog on this water has a mind of its own, and tonight it's made that mind up. The 9:40 isn't going anywhere, friend. Come back at seven when it lifts. And don't fret about the fare. That's already found its way home.`, FERRY) },
    { id: 'mythic', name: 'Mythic frontier', aka: 'epic, biblical cadence, Western myth',
      desc: 'Grand, archaic cadence with "and" chains, landscape as fate, and nameless figures. The voice of Westerns, prophecy and concept albums. Pairs with polysyndeton and short scripture-like lines.',
      hear: '"And" at the start of sentences, weather as omen, timeless tense',
      not: 'epic, not overwrought',
      ref: 'Cormac McCarthy, the King James Bible, Red Dead Redemption, Lord Huron\'s "Strange Trails"',
      prompt: 'a mythic frontier voice: grand archaic cadence, sentences chained with "and", landscape as fate, spare and timeless',
      ex: P(`And the fog came down upon the water and no boat would go out upon it. And the ferryman sat in his house and waited for the morning. At the seventh hour he will cross again. What was paid has been returned.`, FERRY) },
    { id: 'gothic', name: 'Gothic', aka: 'eerie, Southern gothic, haunted',
      desc: 'Dread, decay and something unspoken under the surface. Old houses, weather that watches, a narrator who knows more than they say. The voice of ghost stories and dark folk.',
      hear: 'ominous detail, the uncanny in ordinary things, things left unsaid',
      not: 'eerie, not campy',
      ref: 'Shirley Jackson, Flannery O\'Connor, Edgar Allan Poe, Twin Peaks, Over the Garden Wall',
      prompt: 'a gothic voice: quiet dread, ordinary things made uncanny, something left unsaid',
      ex: P(`No boat goes out in this fog. The harbor master says it plainly, and says nothing else. The lamps on the pier burn and show nothing. At seven, when it has gone back where it came from, the ferry will run. Your money has been returned. Stay off the water tonight.`, FERRY) },
    { id: 'insider', name: 'Conspiratorial insider', aka: 'gossip, "between us", friend-in-the-know',
      desc: 'Lowers its voice and lets you in on something. Makes the reader feel chosen. Works for newsletters, fashion and drops; grating if every message is a secret.',
      hear: '"okay, between us", parentheses, little confidences',
      not: 'insider, not cliquey',
      ref: 'Morning Brew, Glossier, Girls\' Night In newsletter, fashion Substacks',
      prompt: 'a conspiratorial insider voice: lets the reader in on something, confiding asides and parentheticals, a friend in the know',
      ex: P(`Okay, between us: the captain took one look out the window and said absolutely not. So the 9:40's off (fog, very dramatic). Grab the 7:00 tomorrow, it's the prettiest crossing anyway. Refund's already handled, obviously.`, FERRY) },
    { id: 'mentor', name: 'Mentor', aka: 'coach, guide, wise teacher',
      desc: 'Patient and encouraging, explains the why, assumes the reader will do well. The voice of tutorials, coaching apps and good onboarding.',
      hear: 'encouragement, reasons, "here\'s what to do next"',
      not: 'guiding, not condescending',
      ref: 'Khan Academy, Masterclass trailers, Strava coaching, Mr. Rogers',
      prompt: 'a mentor voice: patient, encouraging, explains the why and gives a clear next step, assumes the reader will do well',
      ex: P(`Fog like tonight's is exactly when good captains stay in port, so the 9:40 won't run. Here's your plan: get some rest and catch the 7:00. Your refund's already through, so there's nothing else you need to do.`, FERRY) },
    { id: 'manifesto', name: 'Manifesto', aka: 'rallying cry, declaration, prophetic',
      desc: 'Declares beliefs in short, stacked lines. "We believe." "We will not." Builds momentum through repetition. For brand launches, movements and the About page.',
      hear: 'stacked one-line paragraphs, "we", repeated openings',
      not: 'stirring, not shouty',
      ref: 'the Holstee Manifesto, Apple\'s "Here\'s to the Crazy Ones", the Agile Manifesto',
      prompt: 'a manifesto voice: short stacked declarations, "we believe", repeated openings, building momentum',
      ex: P(`We don't race the fog.<br>We don't gamble with your crossing.<br>We sail when the water is ready, not when the clock is.<br>Tonight, it isn't. Tomorrow at seven, it will be.`, FERRY) },
    { id: 'obsessive', name: 'Enthusiast', aka: 'obsessive hobbyist, nerd, superfan',
      desc: 'Knows too much and loves it. Specific jargon, exact numbers, delight in detail. Builds credibility with insiders; loses newcomers unless it pauses to explain.',
      hear: 'exact specs, jargon used lovingly, tangents',
      not: 'expert, not exclusionary',
      ref: 'Wirecutter, rennerds and audiophile forums, Hodinkee, Bon Appétit test kitchen',
      prompt: 'an enthusiast voice: loves the details, exact numbers and real jargon, delighted tangents, but explains enough for newcomers',
      ex: P(`Advection fog, visibility under 200 metres, and our old 1972 diesel ferry doesn't have the radar to thread that, so the 9:40's scrubbed. The 7:00 should go once the sun gets on it. Refund's processed.`, FERRY) },
    { id: 'sardonic', name: 'Sardonic critic', aka: 'acerbic, cutting, sarcastic',
      desc: 'Sharp, mocking and pleased with itself. Right for reviews, satire and a villain\'s monologue; wrong for any message to a customer.',
      hear: 'sarcasm, scorn for the obvious, a sting at the end',
      not: 'sharp, not cruel',
      ref: 'Dorothy Parker, Christopher Hitchens, Anthony Lane\'s film reviews, The Onion',
      prompt: 'a sardonic, acerbic voice: sharp and mocking, pleased with its own cleverness, saving a sting for the last line',
      ex: P(`Astonishingly, a ferry cannot sail through a cloud, so tonight's 9:40 joins the long tradition of things that did not happen. The 7:00 tomorrow is, we're told, optimistic. Your refund, unlike the boat, has arrived.`, FERRY) }
  ]
});
/* ===== Tone ===== */
pool.groups.push({
  id: 'dials', title: 'Tone dials', slot: 'Tone',
  intro: 'Nielsen Norman Group\'s four dimensions of tone. Each card is one end of a dial; pick where you sit on all four. Same brief throughout: a library book is overdue.',
  terms: [
    { id: 'formal', name: 'Formal', aka: 'professional, proper',
      desc: 'Complete sentences, no contractions or slang, titles and surnames. Signals seriousness and distance. Right for legal, government, academic and some luxury.',
      ref: 'NN/g "The Four Dimensions of Tone of Voice"',
      prompt: 'formal tone: complete sentences, no contractions or slang, measured and professional',
      ex: dial('Formal', 'Casual', 8, `Our records indicate that the item listed below is now overdue. Please return or renew it at your earliest convenience.`, B('Brief', 'library book overdue')) },
    { id: 'casual', name: 'Casual', aka: 'conversational, informal, relaxed',
      desc: 'Talks like a person: contractions, short sentences, everyday phrases, maybe a fragment. Most consumer products sit on this side.',
      ref: 'NN/g tone dimensions, Mailchimp voice and tone',
      prompt: 'casual tone: conversational, contractions, short sentences, how a friendly person would say it out loud',
      ex: dial('Formal', 'Casual', 88, `Hey, that book's a few days late. Bring it back when you can, or renew it online in two taps.`, B('Brief', 'library book overdue')) },
    { id: 'serious', name: 'Serious', aka: 'grave, sober, straight',
      desc: 'No jokes, no playfulness, just care and clarity. Not cold, simply focused. Required when money, health, safety or grief is involved.',
      ref: 'NN/g tone dimensions',
      prompt: 'serious tone: no humor, focused and clear, careful with the reader\'s situation',
      ex: dial('Serious', 'Funny', 10, `This book is now 14 days overdue. Late fees have been paused, but other readers are waiting for it.`, B('Brief', 'library book overdue')) },
    { id: 'funny', name: 'Funny', aka: 'humorous, comic, jokey',
      desc: 'Uses humor to make a message memorable or soften friction. Needs a light situation and a clear joke; a forced one is worse than none.',
      ref: 'NN/g tone dimensions',
      prompt: 'funny tone: a clear, light joke that makes the message memorable, in a situation that can bear it',
      ex: dial('Serious', 'Funny', 90, `Your copy of <i>Moby-Dick</i> has been gone longer than Ahab. Please bring it home.`, B('Brief', 'library book overdue')) },
    { id: 'respectful', name: 'Respectful', aka: 'deferential, courteous, polite',
      desc: 'Shows regard for the reader\'s time, intelligence and situation. Says please, assumes good intent, avoids blame.',
      ref: 'NN/g tone dimensions',
      prompt: 'respectful tone: courteous, assumes good intent, never blames the reader',
      ex: dial('Respectful', 'Irreverent', 10, `We know life gets busy. When you have a moment, please return or renew your book so others can enjoy it too.`, B('Brief', 'library book overdue')) },
    { id: 'irreverenttone', name: 'Irreverent', aka: 'cheeky, rule-bending',
      desc: 'Pokes fun at the situation or the institution. Fun and memorable for the right crowd; risky when the reader is frustrated.',
      ref: 'NN/g tone dimensions',
      prompt: 'irreverent tone: cheeky, pokes fun at the situation, breaks a little etiquette, never insults the reader',
      ex: dial('Respectful', 'Irreverent', 88, `Your book misses you. Also it's overdue. Mostly the second thing.`, B('Brief', 'library book overdue')) },
    { id: 'enthusiastic', name: 'Enthusiastic', aka: 'upbeat, excited, energetic',
      desc: 'Genuine positive energy. Adds exclamation points and warm words. Great for welcomes and wins; grating on bad news.',
      ref: 'NN/g tone dimensions',
      prompt: 'enthusiastic tone: upbeat and positive, energy in the word choice, saving exclamation points for real wins',
      ex: dial('Enthusiastic', 'Matter-of-fact', 12, `Hope you loved it! Your book is due back now, and you can renew it instantly if you're not done yet!`, B('Brief', 'library book overdue')) },
    { id: 'matteroffact', name: 'Matter-of-fact', aka: 'neutral, dry, informational',
      desc: 'States the facts with no emotional coloring. Efficient and trustworthy, the default for system messages and documentation.',
      ref: 'NN/g tone dimensions',
      prompt: 'matter-of-fact tone: neutral and informational, no emotional coloring',
      ex: dial('Enthusiastic', 'Matter-of-fact', 92, `1 item overdue: <i>Moby-Dick</i>. Due 3 Oct. Return or renew.`, B('Brief', 'library book overdue')) }
  ]
});

pool.groups.push({
  id: 'moods', title: 'Emotional tones', slot: 'Tone',
  intro: 'The mood of a single piece. One subject throughout, an old movie theater closing, written in each tone, so the shift is the only thing changing.',
  terms: [
    { id: 'empathetic', name: 'Empathetic', aka: 'compassionate, understanding',
      desc: 'Names the feeling the reader probably has before anything else, and takes it seriously. No silver linings forced on them.',
      prompt: 'an empathetic tone: name what the reader is likely feeling first, take it seriously, no forced silver linings',
      ex: P(`If the Rialto was where you had your first date, or your first job, or the first movie that made you cry, this news is going to sting. It stings for us too.`, THEATER) },
    { id: 'apologetic', name: 'Apologetic', aka: 'contrite, accountable',
      desc: 'Takes responsibility clearly, once, then moves to what happens next. A real apology names what went wrong; a weak one says "for any inconvenience".',
      prompt: 'an apologetic tone: say sorry once and specifically, own the cause, then move straight to what happens next',
      ex: P(`We're sorry. We couldn't keep the Rialto open, and we should have told you sooner than this. Every ticket for future shows will be refunded by Friday.`, THEATER) },
    { id: 'urgent', name: 'Urgent', aka: 'time-sensitive, pressing',
      desc: 'Short sentences, the deadline up front, a single clear action. Earns attention only if it\'s used rarely.',
      prompt: 'an urgent tone: deadline first, short sentences, one clear action',
      ex: P(`Last chance: the Rialto closes Sunday. Final screenings Friday and Saturday at 7. Tickets are going fast.`, THEATER, 'lg') },
    { id: 'celebratory', name: 'Celebratory', aka: 'triumphant, festive, proud',
      desc: 'Focuses on what was achieved and invites everyone to the party, even when the occasion is an ending.',
      prompt: 'a celebratory tone: focus on what was achieved, proud and generous, invite readers to join in',
      ex: P(`Sixty-one years, nineteen thousand screenings, and one very famous popcorn machine. Come celebrate the Rialto with us this weekend. First round of Junior Mints is on the house.`, THEATER) },
    { id: 'nostalgic', name: 'Nostalgic', aka: 'reminiscent, sentimental, retrospective',
      desc: 'Looks back with affection, through concrete sensory memories: smells, sounds, specific nights. Pairs well with a lyrical voice.',
      prompt: 'a nostalgic tone: affectionate look back through specific sensory memories',
      ex: P(`Remember the sticky floor in row J, the projector's rattle before the reel caught, the usher who let you stay for the second feature? That was the Rialto.`, THEATER) },
    { id: 'wistful', name: 'Wistful', aka: 'bittersweet, melancholy, longing',
      desc: 'Quieter than nostalgic: sadness and fondness at the same time, with a sense of something slipping away. The tone of a lot of folk songs.',
      prompt: 'a wistful, bittersweet tone: quiet longing, fondness and sadness held together',
      ex: P(`The marquee will go dark on Sunday. Somebody will take the letters down one at a time, and the street will look like any other street.`, THEATER) },
    { id: 'ominous', name: 'Ominous', aka: 'foreboding, menacing, dark',
      desc: 'Something is coming and it isn\'t good. Builds dread with restraint: understatement, small details, a final line that lands heavy.',
      prompt: 'an ominous tone: restrained dread, small telling details, a heavy final line',
      ex: P(`The developers came on a Tuesday, walked the aisles with a measuring tape, and didn't look at the screen once.`, THEATER) },
    { id: 'hopeful', name: 'Hopeful', aka: 'optimistic, forward-looking',
      desc: 'Acknowledges the loss, then turns toward what could come next. Earned optimism, not cheerleading.',
      prompt: 'a hopeful tone: acknowledge what is ending, then turn honestly toward what could come next',
      ex: P(`The Rialto is closing, but the Friends of the Rialto already have a plan, a lawyer, and four hundred signatures. Buildings close. Stories don't have to.`, THEATER) },
    { id: 'defiant', name: 'Defiant', aka: 'rebellious, fighting, unbowed',
      desc: 'Refuses the premise. Short, punchy, collective "we", often a call to action at the end.',
      prompt: 'a defiant tone: refuse to accept it, punchy collective "we", a clear call to act',
      ex: P(`They say the Rialto is finished. We say not yet. Town hall, Thursday, 6 p.m. Bring your ticket stubs.`, THEATER, 'lg') },
    { id: 'tender', name: 'Tender', aka: 'gentle, intimate, affectionate',
      desc: 'Soft and close, as if speaking to one person you love. Small gestures, quiet words.',
      prompt: 'a tender tone: soft and intimate, as if speaking to one person, small gestures and quiet words',
      ex: P(`Mrs. Alvarez has sold tickets here since 1979. On Sunday she'll sell the last one. If you go, tell her thank you. She'll pretend it's nothing.`, THEATER) },
    { id: 'calm', name: 'Calm', aka: 'measured, even, composed',
      desc: 'Even rhythm and no loaded words. Lowers the temperature of a charged situation.',
      prompt: 'a calm, measured tone: even rhythm, no loaded words, lowers the temperature',
      ex: P(`The Rialto will close on Sunday, October 26. Gift cards can be used until then or refunded at the box office. The building's future will be decided by the council in the spring.`, THEATER) },
    { id: 'suspenseful', name: 'Suspenseful', aka: 'tense, cliffhanging, teasing',
      desc: 'Withholds the key fact and makes the reader lean in. Short beats, a question left open.',
      prompt: 'a suspenseful tone: withhold the key fact, short beats, leave a question hanging',
      ex: P(`Sunday night, at the end of the last show, the projectionist has one more reel to play. He won't say what's on it.`, THEATER) }
  ]
});

pool.groups.push({
  id: 'register', title: 'Register', slot: 'Register',
  intro: 'Register is how formal the language itself is, set by the situation and the relationship. Linguist Martin Joos named five; the rest are registers you\'ll recognize from particular worlds. Same request each time: please silence your phone.',
  terms: [
    { id: 'frozen', name: 'Frozen', aka: 'ceremonial, ritual, fixed',
      desc: 'Language that never changes because the ritual depends on it: vows, oaths, liturgy, inscriptions. Archaic word order and set phrases.',
      ref: 'Martin Joos, "The Five Clocks"; wedding vows, courtroom oaths',
      prompt: 'a frozen, ceremonial register: fixed ritual phrasing, archaic and solemn',
      ex: P(`Let all who enter here keep silence, that the work of this house may be heard.`, PHONE, 'i') },
    { id: 'formalreg', name: 'Formal', aka: 'official, impersonal',
      desc: 'One-way, impersonal, planned. Passive constructions and nouns where speech would use verbs. Notices, policies and announcements.',
      ref: 'Joos\'s five registers',
      prompt: 'a formal register: impersonal and official, complete sentences, no contractions',
      ex: P(`Patrons are requested to ensure that all mobile devices are switched off for the duration of the performance.`, PHONE) },
    { id: 'consultative', name: 'Consultative', aka: 'professional-to-client, advisory',
      desc: 'Polite but two-way, the way a doctor or a good support agent talks to you. Clear, respectful, with reasons.',
      ref: 'Joos\'s five registers',
      prompt: 'a consultative register: polite and professional, two-way, gives a reason',
      ex: P(`Before we begin, could you please silence your phone? The hall carries sound, and even a vibration can be heard on stage.`, PHONE) },
    { id: 'casualreg', name: 'Casual', aka: 'informal, peer-to-peer',
      desc: 'Between friends or peers: contractions, slang, ellipsis, shared context assumed.',
      ref: 'Joos\'s five registers',
      prompt: 'a casual register: how peers talk, contractions and everyday slang, shared context assumed',
      ex: P(`Hey, phones on silent, yeah? Show's starting.`, PHONE, 'lg') },
    { id: 'intimate', name: 'Intimate', aka: 'private, family, couple',
      desc: 'Language between people who know each other completely: private shorthand, nicknames, half sentences. Use it for character dialogue and very personal letters.',
      ref: 'Joos\'s five registers',
      prompt: 'an intimate register: private shorthand between people who know each other completely',
      ex: P(`Babe. Phone. You know what happened last time.`, PHONE, 'lg') },
    { id: 'academic', name: 'Academic', aka: 'scholarly, research prose',
      desc: 'Hedged, cited and precise, with field-specific terms and nominalizations. Credible to experts, hard going for everyone else.',
      ref: 'journal articles, Helen Sword\'s "Stylish Academic Writing"',
      prompt: 'an academic register: precise and hedged, field terms defined, claims tied to evidence',
      ex: P(`Ambient device notifications have been shown to reduce audience attention (Rao et al., 2019); attendees are therefore asked to disable them.`, PHONE) },
    { id: 'technical', name: 'Technical', aka: 'specification, procedural',
      desc: 'Exact, unambiguous and procedural: numbered steps, defined terms, units. Readers want to act on it, not enjoy it.',
      ref: 'Microsoft Writing Style Guide, Google developer documentation style guide',
      prompt: 'a technical register: exact and unambiguous, defined terms and numbered steps',
      ex: P(`1. Open Control Center.<br>2. Enable Do Not Disturb.<br>3. Confirm the ringer switch shows orange.`, PHONE) },
    { id: 'legalese', name: 'Legalese', aka: 'contract language, terms-and-conditions',
      desc: 'Defined terms in capitals, "shall", exhaustive lists, no ambiguity at any cost to readability. Use it for parody, or rewrite it into plain language.',
      ref: 'terms of service, the Plain Writing Act of 2010 (as the cure)',
      prompt: 'legalese, used deliberately: defined terms, "shall", exhaustive and unambiguous',
      ex: P(`The Attendee shall ensure that any and all Devices in the Attendee's possession are rendered silent prior to and throughout the Performance.`, PHONE) },
    { id: 'vernacular', name: 'Vernacular', aka: 'regional, dialect, colloquial',
      desc: 'The speech of a place or a community, with its own words and grammar. Gives characters a home. Do it with research and respect, and lightly on the spelling.',
      ref: 'Zora Neale Hurston, Irvine Welsh, Mark Twain, Daniel Woodrell',
      prompt: 'a vernacular register for this place and community: its words and rhythms, written with respect, light on phonetic spelling',
      ex: P(`Y'all go on and hush them phones now. Picture's fixin' to start.`, PHONE, 'lg') },
    { id: 'corporate', name: 'Corporate-speak', aka: 'business jargon, buzzword soup',
      desc: 'Abstract nouns, buzzwords and passive voice that say little. Worth knowing so you can tell Claude to avoid it, or use it on purpose for satire.',
      ref: 'Weasel words, "Death Sentence" by Don Watson, Dilbert',
      prompt: 'avoid corporate-speak: no buzzwords like leverage, synergy, utilize or "going forward"; use concrete verbs',
      ex: P(`To optimize the attendee experience going forward, we're asking stakeholders to leverage silent mode across all device touchpoints.`, PHONE) },
    { id: 'plainlang', name: 'Plain language', aka: 'plain English, clear writing',
      desc: 'Writing the reader can understand the first time: common words, short sentences, active voice, the main point first. A legal standard in many governments.',
      ref: 'plainlanguage.gov, the UK\'s Plain English Campaign, Hemingway Editor',
      prompt: 'plain language: common words, short sentences, active voice, main point first, readable at an 8th-grade level',
      ex: P(`Please turn your phone to silent. The show starts in 5 minutes.`, PHONE, 'lg') },
    { id: 'global', name: 'Global English', aka: 'controlled English, translation-friendly',
      desc: 'English written for non-native readers and machine translation: no idioms, one meaning per word, literal phrasing, consistent terms.',
      ref: 'Microsoft global-ready content guide, Simplified Technical English (ASD-STE100)',
      prompt: 'global English: literal and idiom-free, short sentences, one term per idea, easy to translate',
      ex: P(`Please set your phone to silent mode. The performance starts at 19:30.`, PHONE) }
  ]
});

/* ===== Structure ===== */
pool.groups.push({
  id: 'openings', title: 'Openings & endings', slot: 'Opening / ending',
  intro: 'The first line decides whether anyone reads the second; the last line decides what they remember. Every sample here opens or closes the same story: a town adding bike lanes.',
  terms: [
    { id: 'medias', name: 'In medias res', aka: 'start in the middle, cold open',
      desc: 'Drop the reader into action already under way and explain later. Instantly gripping; needs a quick orientation in the next paragraph.',
      ref: 'Homer\'s Odyssey, TV cold opens, Breaking Bad\'s pilot',
      prompt: 'open in medias res: start in the middle of the action and fill in context afterward',
      ex: P(`The paint truck was halfway down Elm Street when Gary Pruitt walked out of his hardware store and lay down in front of it.`, LANES) },
    { id: 'anecdote', name: 'Anecdotal lede', aka: 'feature lede, scene lede',
      desc: 'Opens with one person in one moment, then widens to the larger story. The classic magazine and Wall Street Journal opening.',
      ref: 'the Wall Street Journal "A-hed", longform features',
      prompt: 'an anecdotal lede: open on one specific person in one moment, then widen to the bigger story',
      ex: P(`Marisol Ortega has biked her daughter to school on Route 9 every morning for three years, one hand on the bars and one on the trailer. Next month, for the first time, she'll have a lane.`, LANES) },
    { id: 'questionlede', name: 'Question lede', aka: 'rhetorical opener',
      desc: 'Opens with a question the reader wants answered. Use sparingly; editors dislike it because it\'s so often lazy. Works when the question is specific and surprising.',
      prompt: 'open with one specific, surprising question the piece goes on to answer',
      ex: P(`What happens to a small-town Main Street when you take away 40 parking spaces and give them to bicycles?`, LANES, 'lg') },
    { id: 'statlede', name: 'Startling stat', aka: 'number lede, data hook',
      desc: 'Leads with a single striking number, then explains it. One number, not three.',
      prompt: 'open with one startling, specific statistic, then explain why it matters',
      ex: P(`Eleven. That's how many cyclists were hit on Route 9 last year, in a town of 6,000 people.`, LANES, 'lg') },
    { id: 'scene', name: 'Scene-setting', aka: 'establishing shot, descriptive opener',
      desc: 'Opens like a film\'s establishing shot: place, light, weather, sound. Slow, atmospheric, good for essays and fiction.',
      prompt: 'open with a short establishing scene: place, light and sound before any people or facts',
      ex: P(`At six in the morning Route 9 is empty except for the gulls and a single bread truck, and the new white lines shine wet in the low sun.`, LANES) },
    { id: 'nutgraf', name: 'Nut graf', aka: 'nut graph, "so what" paragraph',
      desc: 'The paragraph after a feature lede that says what the story is really about and why it matters now. Without it the reader drifts.',
      ref: 'newsroom feature writing, Poynter',
      prompt: 'follow the opening with a nut graf: one paragraph stating what this story is about and why it matters now',
      ex: P(`<span class="note">[after the lede]</span> Ortega is one of hundreds of residents caught in a fight that small towns across the state are having: whether streets built for cars can be shared, and who pays when they are.`, LANES) },
    { id: 'kicker', name: 'Kicker', aka: 'closer, button, sting',
      desc: 'A last line with a twist, a quote or an image that lands the piece. Often a callback to the opening.',
      ref: 'newspaper features, comedy "buttons"',
      prompt: 'end with a kicker: a final line, quote or image that lands the piece with a small twist',
      ex: P(`Asked if he'd ever ride the new lane himself, Pruitt shrugged. "I sold forty bikes this spring," he said. "Somebody ought to."`, LANES) },
    { id: 'circleback', name: 'Circle-back ending', aka: 'bookend, ring ending, callback close',
      desc: 'Return at the end to the image or person from the opening, changed. Satisfying because it closes a loop the reader didn\'t know was open.',
      prompt: 'end by circling back to the opening image or person, showing what has changed',
      ex: P(`<span class="note">[opening: Marisol, one hand on the trailer]</span> On the first morning of the new lane, Marisol rode both hands on the bars.`, LANES) },
    { id: 'cta', name: 'Call to action', aka: 'CTA, ask, next step',
      desc: 'Ends by telling the reader exactly what to do next, with one verb and one place to do it.',
      prompt: 'end with one clear call to action: a single verb and where to do it',
      ex: P(`The council votes Tuesday at 7 p.m. If you want a say in where the lanes go, come to town hall or comment at elmtown.gov/lanes.`, LANES) },
    { id: 'openloop', name: 'Open loop', aka: 'cliffhanger, curiosity gap',
      desc: 'Raises a question early and doesn\'t answer it until later, or ever. Keeps readers moving through a long piece or to the next episode.',
      prompt: 'use an open loop: raise a question early, withhold the answer until near the end',
      ex: P(`Only one person on the council voted no. Nobody expected it to be him, and it took me three weeks to find out why.`, LANES) }
  ]
});

pool.groups.push({
  id: 'frameworks', title: 'Frameworks', slot: 'Structure',
  intro: 'Named shapes for a whole piece. Each sample is the skeleton, with its parts labelled, so you can see the order things arrive in.',
  terms: [
    { id: 'pyramid', name: 'Inverted pyramid', aka: 'news structure, most-important-first',
      desc: 'The most important facts first (who, what, when, where), then details in falling order of importance, so the piece can be cut from the bottom. Still the backbone of news and good emails.',
      ref: 'AP style, wire reporting',
      prompt: 'inverted pyramid structure: the most important facts in the first sentence, details in descending importance',
      ex: P(`<span class="note">WHAT</span> Elmtown will add 4 miles of protected bike lanes this fall. <span class="note">DETAIL</span> The council approved the $1.2M plan 4–1 Tuesday. <span class="note">BACKGROUND</span> The vote follows a year of...`, LANES) },
    { id: 'bluf', name: 'BLUF', aka: 'bottom line up front',
      desc: 'Military-born: state the conclusion or request in the first line, then support it. The best default for work email and memos.',
      ref: 'US Army writing standards, "Writing for busy readers" (Rogers & Lasky-Fink)',
      prompt: 'BLUF: put the bottom line (the decision or ask) in the first sentence, then the supporting reasons',
      ex: P(`<b>Bottom line:</b> I need your sign-off on the Elm St. lane design by Friday.<br><b>Why:</b> The paint crew is booked Monday.<br><b>Details:</b> Drawings attached; changes from v2 are in red.`, LANES) },
    { id: 'scqa', name: 'SCQA', aka: 'Situation, Complication, Question, Answer',
      desc: 'Set the scene, introduce the problem, pose the question it raises, answer it. McKinsey\'s favorite way to open a recommendation.',
      ref: 'Barbara Minto, "The Pyramid Principle"',
      prompt: 'SCQA structure: situation, complication, the question it raises, then the answer',
      ex: P(`<span class="note">S</span> Route 9 is the only road to the school. <span class="note">C</span> Cyclist injuries doubled last year. <span class="note">Q</span> How do we make it safe without closing it? <span class="note">A</span> Protected lanes and a 25 mph limit.`, LANES) },
    { id: 'minto', name: 'Pyramid principle', aka: 'Minto pyramid, answer-first logic',
      desc: 'Lead with the single main point, then group supporting arguments into three or so, each backed by its own evidence. Structures thinking as much as writing.',
      ref: 'Barbara Minto, "The Pyramid Principle"',
      prompt: 'pyramid principle: lead with the main point, then three grouped supporting arguments, each with evidence',
      ex: P(`<b>We should build the lanes.</b><br>1. They're safer: injuries fell 40% in comparable towns.<br>2. They're cheap: state grants cover 80%.<br>3. They help shops: foot traffic rose on similar streets.`, LANES) },
    { id: 'pas', name: 'Problem–Agitate–Solve', aka: 'PAS',
      desc: 'Name the pain, make it vivid, then offer the fix. The copywriter\'s workhorse; manipulative if the agitation is exaggerated.',
      ref: 'direct-response copywriting',
      prompt: 'Problem–Agitate–Solve: name the problem, make it vivid, then present the solution',
      ex: P(`<span class="note">P</span> Biking to school on Route 9 is dangerous. <span class="note">A</span> Trucks pass at 50 mph, inches from kids. <span class="note">S</span> Protected lanes put a curb between them.`, LANES) },
    { id: 'aida', name: 'AIDA', aka: 'Attention, Interest, Desire, Action',
      desc: 'The oldest marketing funnel: grab attention, build interest, create desire, ask for action. Every landing page secretly follows it.',
      ref: 'E. St. Elmo Lewis, 1898',
      prompt: 'AIDA structure: grab attention, build interest, create desire, then a clear call to action',
      ex: P(`<span class="note">A</span> Ride to school without a single car beside you. <span class="note">I</span> Elmtown's new lanes open in September. <span class="note">D</span> Picture Saturday rides to the lake. <span class="note">A</span> Join the opening ride, Sept 6.`, LANES) },
    { id: 'bab', name: 'Before–After–Bridge', aka: 'BAB',
      desc: 'Show life now, show life after, then explain how to get from one to the other. Simpler and gentler than PAS.',
      prompt: 'Before–After–Bridge: describe life now, life after, then how to get there',
      ex: P(`<span class="note">BEFORE</span> You drive the kids four blocks to school. <span class="note">AFTER</span> They ride, and you get your morning back. <span class="note">BRIDGE</span> The Elm St. lanes connect every school by fall.`, LANES) },
    { id: 'whatsowhat', name: 'What? So what? Now what?', aka: 'reflective model, Rolfe\'s model',
      desc: 'Three-step reflection: what happened, why it matters, what we do about it. Great for updates, postmortems and reports.',
      ref: 'Rolfe, Freshwater & Jasper (2001)',
      prompt: 'structure it as What? So what? Now what?: what happened, why it matters, what we do next',
      ex: P(`<b>What:</b> Lane construction slipped two weeks.<br><b>So what:</b> It now overlaps the first day of school.<br><b>Now what:</b> We'll finish Route 9 first and do Elm after.`, LANES) },
    { id: 'listicle', name: 'Listicle', aka: 'numbered list article',
      desc: 'A piece organized as a numbered list. Skimmable and shareable. Better when each item has a real point and the list has a reason to be in that order.',
      prompt: 'a listicle: a numbered list where each item has a bold one-line point and two sentences of support',
      ex: P(`<b>5 things to know about the new lanes</b><br>1. They open Sept 6.<br>2. Parking moves to side streets.<br>3. E-bikes are allowed...`, LANES) },
    { id: 'faq', name: 'Q&A / FAQ', aka: 'question and answer, interview format',
      desc: 'Structure built from the reader\'s real questions, in the order they\'d ask them. Great for policies and explainers; bad as a dumping ground.',
      prompt: 'a Q&A format: the reader\'s real questions in the order they\'d ask them, short direct answers',
      ex: P(`<b>Will I lose my parking spot?</b><br>Only on Elm between 2nd and 5th. Side streets gain 30 spaces.<br><b>Can I ride an e-bike in the lane?</b><br>Yes, up to 20 mph.`, LANES) },
    { id: 'threeact', name: 'Three-act structure', aka: 'setup, confrontation, resolution',
      desc: 'Setup, rising conflict, resolution. The shape of most films and many good case studies and brand stories.',
      ref: 'Syd Field, "Screenplay"',
      prompt: 'three-act structure: setup, rising conflict, resolution',
      ex: P(`<span class="note">I</span> A quiet town with one dangerous road. <span class="note">II</span> A crash, a petition, a shop owner who fights back. <span class="note">III</span> A vote, a compromise, and a lane that opens on the first day of school.`, LANES) },
    { id: 'herosjourney', name: 'Hero\'s journey', aka: 'monomyth',
      desc: 'Call, refusal, mentor, threshold, trials, transformation, return. Over-applied, but useful for founder stories and customer case studies where the customer is the hero.',
      ref: 'Joseph Campbell, "The Hero with a Thousand Faces"; Christopher Vogler; Donald Miller\'s StoryBrand',
      prompt: 'a hero\'s journey arc with the reader or customer as the hero and us as the guide',
      ex: P(`<span class="note">CALL</span> Marisol's daughter is nearly hit. <span class="note">TRIALS</span> Petitions, a hostile meeting, a lost vote. <span class="note">RETURN</span> She rides the new lane on the first morning.`, LANES) },
    { id: 'kishotenketsu', name: 'Kishōtenketsu', aka: 'four-act structure without conflict',
      desc: 'An East Asian four-part structure: introduction, development, a twist that seems unrelated, then a conclusion that reconciles them. Builds interest without needing a villain.',
      ref: 'classical Chinese and Japanese poetry, yonkoma manga, Studio Ghibli films',
      prompt: 'kishōtenketsu structure: introduce, develop, an unexpected turn, then reconcile them, no central conflict needed',
      ex: P(`<span class="note">KI</span> The lanes are painted. <span class="note">SHŌ</span> Kids start riding. <span class="note">TEN</span> Meanwhile, the old men at the diner start a bike club. <span class="note">KETSU</span> Now the kids race them on Saturdays.`, LANES) },
    { id: 'braided', name: 'Braided essay', aka: 'segmented essay, collage essay',
      desc: 'Two or three threads, often a personal story, a piece of history and an idea, alternate in short sections until they illuminate each other.',
      ref: 'Brenda Miller, Eula Biss "The Pain Scale", Jo Ann Beard',
      prompt: 'a braided essay: alternate short sections from two or three threads until they illuminate each other',
      ex: P(`<span class="note">1</span> My father taught me to ride on this road. <span class="note">2</span> Route 9 was paved in 1931 for milk trucks. <span class="note">1</span> He never let go of the seat. <span class="note">3</span> A lane is a promise someone will.`, LANES) },
    { id: 'diataxis', name: 'Diátaxis', aka: 'tutorial / how-to / reference / explanation',
      desc: 'A framework for documentation: four kinds of doc, each with a different job. Tutorials teach, how-tos solve, reference describes, explanation explains why. Mixing them is what makes docs confusing.',
      ref: 'Daniele Procida, diataxis.fr',
      prompt: 'follow Diátaxis: decide whether this is a tutorial, how-to guide, reference or explanation, and write only that kind',
      ex: P(`<b>Tutorial</b> Your first ride on the lane network.<br><b>How-to</b> Report a blocked lane.<br><b>Reference</b> Lane map and rules.<br><b>Explanation</b> Why the lanes are protected, not painted.`, LANES) }
  ]
});
/* ===== Devices ===== */
pool.groups.push({
  id: 'repetition', title: 'Repetition & rhythm', slot: 'Device',
  intro: 'Devices that work by sound and pattern. The highlighted words in each sample are the device.',
  terms: [
    { id: 'anaphora', name: 'Anaphora', aka: 'repeated opening',
      desc: 'The same word or phrase at the start of successive sentences or clauses. Builds momentum; the engine of great speeches.',
      ref: 'Churchill\'s "We shall fight on the beaches", MLK\'s "I have a dream"',
      prompt: 'use anaphora: repeat the same opening words across three successive sentences to build momentum',
      ex: P(`<mark>We'll</mark> leave at dawn. <mark>We'll</mark> follow the river. <mark>We'll</mark> come home when the water tells us to.`) },
    { id: 'epistrophe', name: 'Epistrophe', aka: 'repeated ending, epiphora',
      desc: 'The same word or phrase at the end of successive clauses. Drives a single word home.',
      ref: 'Lincoln\'s "of the people, by the people, for the people"',
      prompt: 'use epistrophe: end several successive clauses with the same word or phrase',
      ex: P(`She left the town <mark>without a word</mark>. She crossed the state line <mark>without a word</mark>. Forty years later she wrote to us, <mark>without a word</mark> of why.`) },
    { id: 'tricolon', name: 'Rule of three', aka: 'tricolon, triad',
      desc: 'Three parallel items. Two feels incomplete and four feels like a list; three feels finished. The most useful device in this book.',
      ref: '"Veni, vidi, vici"; "Life, liberty and the pursuit of happiness"',
      prompt: 'use the rule of three: group ideas or phrases in parallel threes',
      ex: P(`The cabin had <mark>no power</mark>, <mark>no signal</mark>, and <mark>no reason</mark> to leave.`, '', 'lg') },
    { id: 'polysyndeton', name: 'Polysyndeton', aka: 'many conjunctions, and-chain',
      desc: 'Lots of "and"s where commas would do. Slows the sentence, piles things up, and sounds biblical or breathless.',
      ref: 'Cormac McCarthy, Hemingway, the King James Bible',
      prompt: 'use polysyndeton: chain items with repeated "and" for a breathless, accumulating rhythm',
      ex: P(`We packed the guitars <mark>and</mark> the tent <mark>and</mark> the cooler <mark>and</mark> the dog <mark>and</mark> drove west until the radio gave up.`) },
    { id: 'asyndeton', name: 'Asyndeton', aka: 'no conjunctions',
      desc: 'Drops the conjunctions entirely. Speeds the sentence up and makes it feel urgent or relentless.',
      ref: '"I came, I saw, I conquered"',
      prompt: 'use asyndeton: drop conjunctions from a list for speed and urgency',
      ex: P(`Rain<mark>,</mark> wind<mark>,</mark> mud<mark>,</mark> three flat tires<mark>,</mark> one show.`, '', 'lg') },
    { id: 'epizeuxis', name: 'Epizeuxis', aka: 'immediate repetition',
      desc: 'A word repeated right away for emphasis. Very loud; use once per piece at most.',
      ref: '"Location, location, location"; King Lear\'s "Never, never, never"',
      prompt: 'use epizeuxis once: repeat a single word immediately for emphasis',
      ex: P(`It was <mark>gone, gone, gone</mark>, the way a train is gone.`, '', 'lg') },
    { id: 'anadiplosis', name: 'Anadiplosis', aka: 'chain repetition, linking words',
      desc: 'The last word of one clause becomes the first word of the next, creating a chain of cause and effect.',
      ref: 'Yoda\'s "Fear leads to anger. Anger leads to hate."',
      prompt: 'use anadiplosis: end one clause with a word and begin the next clause with it, forming a chain',
      ex: P(`The road led to the <mark>river</mark>. The <mark>river</mark> led to the <mark>sea</mark>. The <mark>sea</mark> led nowhere at all.`) },
    { id: 'alliteration', name: 'Alliteration', aka: 'consonance, head rhyme',
      desc: 'Repeating initial sounds. Makes phrases sticky; great for names, taglines and titles, silly when stacked.',
      prompt: 'use alliteration lightly: repeat initial consonant sounds in a key phrase to make it memorable',
      ex: P(`<mark>S</mark>alt, <mark>s</mark>moke and <mark>s</mark>ummer <mark>s</mark>torms.`, '', 'xl') },
    { id: 'isocolon', name: 'Parallelism', aka: 'isocolon, parallel structure',
      desc: 'Clauses with the same grammatical shape and similar length. Makes ideas feel balanced and related, and is easier to read than mismatched lists.',
      prompt: 'use parallel structure: put related ideas in clauses of the same grammatical shape',
      ex: P(`<mark>Easy to start</mark>, <mark>hard to quit</mark>, <mark>impossible to forget</mark>.`, '', 'lg') },
    { id: 'variety', name: 'Sentence variety', aka: 'rhythm, short-long-short',
      desc: 'Mix long sentences with short ones. The short one after a long run hits hard. Monotone sentence length is the most common thing that makes prose sound machine-written.',
      ref: 'Gary Provost\'s "This sentence has five words" passage',
      prompt: 'vary sentence length deliberately: several longer flowing sentences, then a very short one for emphasis',
      ex: P(`We drove for nine hours, through wheat and wind farms and towns that were just a grain elevator and a bar, the sun going down behind us and coming up ahead. <mark>Then the sea.</mark>`) }
  ]
});

pool.groups.push({
  id: 'turns', title: 'Contrast & turn', slot: 'Device',
  intro: 'Devices that work by surprise: setting things against each other, saying less than you mean, or more.',
  terms: [
    { id: 'antithesis', name: 'Antithesis', aka: 'contrast, opposition',
      desc: 'Puts opposing ideas side by side in parallel form. Sharp and quotable.',
      ref: '"It was the best of times, it was the worst of times"',
      prompt: 'use antithesis: set two opposing ideas side by side in parallel form',
      ex: P(`We were <mark>too young to stay</mark> and <mark>too old to run</mark>.`, '', 'lg') },
    { id: 'chiasmus', name: 'Chiasmus', aka: 'reversal, ABBA, antimetabole',
      desc: 'Repeats an idea in reverse order. Feels clever and complete; one per piece.',
      ref: 'JFK\'s "Ask not what your country can do for you..."',
      prompt: 'use one chiasmus: repeat a phrase with its terms reversed',
      ex: P(`You don't <mark>find the road</mark>; <mark>the road finds</mark> you.`, '', 'lg') },
    { id: 'litotes', name: 'Litotes', aka: 'ironic double negative',
      desc: 'Affirms something by denying its opposite. "Not bad" for "good". Dry, understated, very British.',
      prompt: 'use litotes: affirm something by negating its opposite, for dry understatement',
      ex: P(`The drive through the pass was <mark>not without incident</mark>.`, '', 'lg') },
    { id: 'hyperbole', name: 'Hyperbole', aka: 'exaggeration, overstatement',
      desc: 'Wild exaggeration for effect, never meant literally. Comic and vivid.',
      prompt: 'use hyperbole: a clearly impossible exaggeration for comic or vivid effect',
      ex: P(`That motel had seen <mark>more ghosts than the Vatican</mark>.`, '', 'lg') },
    { id: 'meiosis', name: 'Understatement', aka: 'meiosis, deliberate downplaying',
      desc: 'Describes something big as small. The emotional weight is felt in the gap.',
      ref: 'Monty Python\'s "Tis but a scratch", Apollo 13\'s "we\'ve had a problem"',
      prompt: 'use understatement: describe something big as if it were minor, letting the gap carry the weight',
      ex: P(`The house had burned to the foundation. "<mark>Well,</mark>" my grandmother said, "<mark>that's a nuisance.</mark>"`) },
    { id: 'irony', name: 'Irony', aka: 'verbal irony, situational irony',
      desc: 'Saying the opposite of what you mean, or showing an outcome that\'s the opposite of what was expected. Readers have to be in on it.',
      prompt: 'use irony: let the stated meaning or outcome be the opposite of what\'s expected, so the reader catches it',
      ex: P(`The fire station was the only building in town that <mark>burned down</mark> that summer.`) },
    { id: 'bathos', name: 'Bathos', aka: 'anticlimax, deflation',
      desc: 'Builds up to something grand and then drops to something trivial. A comic tool.',
      prompt: 'use bathos: build to something grand, then deflate it with something trivial',
      ex: P(`He'd crossed deserts, survived a shipwreck, outlived three wives, and was finally undone by <mark>a folding lawn chair</mark>.`) },
    { id: 'paradox', name: 'Paradox', aka: 'apparent contradiction',
      desc: 'A statement that seems self-contradictory but holds a truth. Makes the reader stop and think.',
      prompt: 'use a paradox: a seemingly contradictory statement that reveals something true',
      ex: P(`<mark>The only way to keep a place is to leave it.</mark>`, '', 'lg') },
    { id: 'zeugma', name: 'Zeugma', aka: 'syllepsis',
      desc: 'One word governs two others in different senses. Witty and literary.',
      ref: 'Dickens: "Miss Bolo... went straight home in a flood of tears and a sedan chair"',
      prompt: 'use zeugma: one verb applied to two objects in two different senses',
      ex: P(`She <mark>lost</mark> her keys and her temper in the same parking lot.`, '', 'lg') },
    { id: 'rhetq', name: 'Rhetorical question', aka: 'erotema',
      desc: 'A question asked for effect, with an obvious answer. Engages the reader; a chain of them sounds like a sales pitch.',
      prompt: 'use one rhetorical question to engage the reader, then answer it with a statement',
      ex: P(`<mark>Who among us hasn't driven past the exit on purpose, just to keep the song going?</mark>`) },
    { id: 'apophasis', name: 'Apophasis', aka: 'paralipsis, "I won\'t mention"',
      desc: 'Mentions something by saying you won\'t mention it. Sly and a bit political.',
      prompt: 'use apophasis: raise a point by claiming you won\'t mention it',
      ex: P(`<mark>I won't bring up</mark> the time he sold the band van for a mandolin. That's his business.`) },
    { id: 'aposiopesis', name: 'Aposiopesis', aka: 'breaking off, trailing off',
      desc: 'A sentence that stops before it finishes, as if the speaker can\'t or won\'t go on. Emotional or ominous.',
      prompt: 'use aposiopesis: break a sentence off unfinished to suggest emotion or dread',
      ex: P(`If you ever see the light out on the lake after midnight, <mark>don't</mark>...`, '', 'lg') }
  ]
});

pool.groups.push({
  id: 'image', title: 'Image & detail', slot: 'Device',
  intro: 'Devices that make writing concrete: comparisons, sensory detail and specifics. Most of what people mean by "vivid".',
  terms: [
    { id: 'metaphor', name: 'Metaphor', aka: 'implied comparison',
      desc: 'Says one thing is another. Fresh metaphors make prose sing; worn ones ("a rollercoaster of emotions") make it sag.',
      prompt: 'use one fresh, specific metaphor rather than a familiar one',
      ex: P(`The town was <mark>a held breath</mark> between two mountains.`, '', 'lg') },
    { id: 'extmetaphor', name: 'Extended metaphor', aka: 'conceit, sustained metaphor',
      desc: 'One metaphor carried through a whole paragraph or piece. Ambitious; holds a piece together when it fits.',
      ref: 'Shakespeare\'s "All the world\'s a stage", metaphysical poets',
      prompt: 'sustain one extended metaphor through the paragraph',
      ex: P(`Memory is <mark>an old radio</mark>. You <mark>turn the dial</mark> and get <mark>static</mark>, then <mark>a song you half know</mark>, then <mark>a voice that fades before</mark> you can tell whose it is.`) },
    { id: 'simile', name: 'Simile', aka: 'explicit comparison, "like" or "as"',
      desc: 'Compares with "like" or "as". Easier to get right than metaphor; the comparison should surprise but feel exactly true.',
      prompt: 'use a simile with a surprising but exact comparison',
      ex: P(`The highway shimmered <mark>like a long sheet of tinfoil</mark> someone had forgotten to put away.`) },
    { id: 'personification', name: 'Personification', aka: 'anthropomorphism, prosopopoeia',
      desc: 'Gives human qualities to places, objects or weather. Makes landscapes into characters.',
      prompt: 'use personification: give a place or object human qualities',
      ex: P(`The old house <mark>sighed</mark> every time the wind <mark>asked it a question</mark>.`, '', 'lg') },
    { id: 'pathetic', name: 'Pathetic fallacy', aka: 'weather as mood',
      desc: 'Nature mirrors the characters\' feelings: storms for anger, fog for confusion. A cliché done badly, powerful done quietly.',
      ref: 'John Ruskin coined it; Wuthering Heights',
      prompt: 'use pathetic fallacy subtly: let the weather or landscape mirror the emotion without naming it',
      ex: P(`They signed the papers in silence. Outside, <mark>the rain had settled in for the week</mark>.`) },
    { id: 'synecdoche', name: 'Synecdoche', aka: 'part for whole, metonymy',
      desc: 'A part stands for the whole ("all hands on deck") or a related thing stands in ("the Crown"). Compact and evocative.',
      prompt: 'use synecdoche or metonymy: let a part or associated thing stand for the whole',
      ex: P(`By midnight the bar was down to <mark>three cowboy hats and a tambourine</mark>.`) },
    { id: 'concrete', name: 'Concrete detail', aka: 'specificity, the telling detail',
      desc: 'Name the specific thing: not "a car" but "a 1987 Buick with one blue door". One right detail does the work of a paragraph of adjectives.',
      ref: 'Strunk & White\'s "use definite, specific, concrete language"',
      prompt: 'use concrete, specific details (brand names, numbers, exact objects) instead of general words and adjectives',
      ex: P(`<s class="cut">He drove an old car.</s><br>He drove <mark>a 1987 Buick with one blue door</mark> and <mark>a rosary on the mirror</mark>.`) },
    { id: 'sensory', name: 'Sensory detail', aka: 'the five senses, imagery',
      desc: 'Goes beyond sight to sound, smell, touch and taste. Smell is the fastest route to memory.',
      prompt: 'include sensory detail beyond sight: at least one sound, smell or texture',
      ex: P(`The cabin smelled of <mark>woodsmoke and wet dog</mark>, and the screen door <mark>slapped shut</mark> behind us.`) },
    { id: 'showtell', name: 'Show, don\'t tell', aka: 'dramatize, imply',
      desc: 'Instead of naming an emotion, show the behavior that reveals it. The reader works it out and believes it more.',
      ref: 'Chekhov: "Don\'t tell me the moon is shining; show me the glint of light on broken glass"',
      prompt: 'show, don\'t tell: reveal emotion through action and detail rather than naming it',
      ex: P(`<s class="cut">She was nervous.</s><br><mark>She checked the ticket again, though she'd memorized the seat number an hour ago.</mark>`) },
    { id: 'callback', name: 'Callback', aka: 'running gag, echo',
      desc: 'Brings back a detail, phrase or joke from earlier, now with more meaning. Rewards attentive readers.',
      prompt: 'plant a detail early and call back to it near the end with new meaning',
      ex: P(`<span class="note">p. 1</span> Dad never once let go of the bike seat.<br><span class="note">p. 9</span> At the funeral I realized <mark>he'd never let go of anything</mark>.`) },
    { id: 'numbers', name: 'Exact numbers', aka: 'precision, quantification',
      desc: 'A specific number is more believable and more vivid than "many" or "a lot". Odd numbers feel more real than round ones.',
      prompt: 'use exact numbers instead of vague quantities; specific beats round',
      ex: P(`<s class="cut">We played a lot of shows.</s><br>We played <mark>212 shows</mark> in <mark>37 states</mark> and broke <mark>one</mark> axle.`) }
  ]
});

/* ===== Styles & references ===== */
pool.groups.push({
  id: 'pov', title: 'Point of view & narration', slot: 'Point of view',
  intro: 'Who is telling the story and how close we are to them. One scene throughout: a stranger walks into a diner at night.',
  terms: [
    { id: 'first', name: 'First person', aka: 'I narrator',
      desc: 'The narrator is "I". Intimate and limited: we know only what they know, filtered through their voice.',
      prompt: 'first-person narration: an "I" narrator with a distinct voice, limited to what they know',
      ex: P(`I was wiping down the counter when he came in, and I knew right away he wasn't from here. Nobody from here takes off their hat.`, DINER) },
    { id: 'second', name: 'Second person', aka: 'you narrator',
      desc: 'The reader is "you". Rare in fiction, immersive and a little unsettling. Common in choose-your-own adventures, games and some essays.',
      ref: 'Jay McInerney\'s "Bright Lights, Big City", Lorrie Moore, interactive fiction',
      prompt: 'second-person narration: address the reader as "you" as if they are the character',
      ex: P(`You push open the door and the bell announces you to a room that goes quiet. You take the stool nearest the exit. You always do.`, DINER) },
    { id: 'closethird', name: 'Close third', aka: 'limited third person, third-person limited',
      desc: 'Uses "he" or "she" but stays inside one character\'s head. The default of modern fiction: intimacy with flexibility.',
      prompt: 'close third-person narration: "she" or "he", but staying inside one character\'s perceptions and thoughts',
      ex: P(`Dolores saw him before the bell finished ringing. Tall, wet coat, a suitcase too nice for the bus. She poured the coffee before he asked. Men like that never asked.`, DINER) },
    { id: 'omniscient', name: 'Omniscient', aka: 'all-knowing narrator, godlike',
      desc: 'A narrator who knows everything, can move between minds and see the future. Grand and old-fashioned; lets you foreshadow.',
      ref: 'Tolstoy, George Eliot, Gabriel García Márquez',
      prompt: 'omniscient narration: a narrator who knows every character\'s mind and what will happen later',
      ex: P(`The stranger thought no one noticed him. The waitress had. So had the cook, who would remember his face to a policeman in three weeks' time, and get it wrong.`, DINER) },
    { id: 'unreliable', name: 'Unreliable narrator', aka: 'untrustworthy narrator',
      desc: 'A narrator whose account we learn to doubt, through gaps, contradictions or self-justification. The reader becomes a detective.',
      ref: 'Nabokov\'s "Lolita", Ishiguro\'s "The Remains of the Day", "Gone Girl"',
      prompt: 'an unreliable narrator: let small contradictions and self-justifications make the reader doubt the account',
      ex: P(`I didn't stare at him. I want that to be clear. I simply noticed, as anyone would, that he had my brother's watch on his wrist.`, DINER) },
    { id: 'freeindirect', name: 'Free indirect style', aka: 'free indirect discourse',
      desc: 'Third-person narration that slips into a character\'s own words and judgments without quotation marks. Lets the narrator be ironic about a character from inside them.',
      ref: 'Jane Austen, Flaubert, Sally Rooney',
      prompt: 'free indirect style: third-person narration that slips into the character\'s own words and judgments without quotation marks',
      ex: P(`Dolores refilled his cup. A suitcase like that, in a place like this. Well, it was none of her business. It was absolutely her business.`, DINER) },
    { id: 'stream', name: 'Stream of consciousness', aka: 'interior monologue',
      desc: 'The flow of a mind, unedited: associations, fragments, run-ons. Intense and demanding.',
      ref: 'Virginia Woolf, James Joyce, Faulkner\'s "The Sound and the Fury"',
      prompt: 'stream of consciousness: an unbroken flow of thought, associations and fragments, loose punctuation',
      ex: P(`bell rings and the coffee's burnt again and who wears a coat like that in June, Ma had one like it, the green one, smelled like cedar, he's looking at the pie case, nobody looks at the pie case`, DINER, 'i') },
    { id: 'epistolary', name: 'Epistolary', aka: 'letters, diary, documents',
      desc: 'A story told through letters, diary entries, emails or texts. Intimate, and the gaps between documents do the storytelling.',
      ref: '"Dracula", "Frankenstein", "The Color Purple", "Where\'d You Go, Bernadette"',
      prompt: 'epistolary form: tell it through letters, diary entries or messages, letting the gaps between them do the work',
      ex: P(`<i>June 14.</i> Dear Ruth, a man came in tonight with a suitcase and your father's way of holding a fork. I didn't ask his name. I'm writing so I'll stop thinking about it.`, DINER) },
    { id: 'found', name: 'Found document', aka: 'faux artifact, in-world text',
      desc: 'Writing presented as a real object from the story\'s world: a police report, a pamphlet, a ledger, a field guide. Great for worldbuilding, ARGs and album lore.',
      ref: 'House of Leaves, SCP Foundation, Lord Huron\'s George Ranger Johnson pulp novels',
      prompt: 'a found document: write it as an in-world artifact (report, ledger, pamphlet) with its own format and voice',
      ex: P(`<span class="slab">Pine Lake County Sheriff · Incident Log</span><br>23:42. Caller (waitress, Moonlite Diner) reports male, approx. 40, grey coat, carrying suitcase. Paid in silver dollars. Departed on foot, north toward the lake.`, DINER) },
    { id: 'frame', name: 'Frame story', aka: 'story within a story, nested narrative',
      desc: 'An outer story in which someone tells the inner story. Adds a storyteller\'s voice and a sense of legend.',
      ref: '"The Canterbury Tales", "Frankenstein", "The Princess Bride", "Heart of Darkness"',
      prompt: 'a frame story: an outer scene in which a character tells the main story',
      ex: P(`"You want to know why there's a light on the lake at night?" The old man set his cup down. "Then you've got to know about the night the stranger came into the Moonlite."`, DINER) },
    { id: 'present', name: 'Present tense', aka: 'present-tense narration',
      desc: 'Tells events as they happen. Immediate and cinematic; can feel breathless over a long piece.',
      prompt: 'narrate in the present tense for immediacy',
      ex: P(`The bell rings. He stands in the doorway, dripping. Nobody moves. Then the jukebox clicks to the next song, and everyone pretends to be busy.`, DINER) }
  ]
});

pool.groups.push({
  id: 'authors', title: 'Writers to point at', slot: 'Style reference',
  intro: 'Names a model recognizes, each shown as a short pastiche of the same diner scene so you can hear the moves. Pair a name with its description; the description is what actually steers.',
  terms: [
    { id: 'hemingway', name: 'Ernest Hemingway', aka: 'iceberg theory, spare style',
      desc: 'Short declaratives, plain words, repetition, and almost everything important left under the surface. Dialogue carries the emotion.',
      ref: '"Hills Like White Elephants", "The Old Man and the Sea"',
      prompt: 'in the spare style of Hemingway: short declarative sentences, plain words, emotion left beneath the surface',
      ex: P(`He came in out of the rain and sat at the counter. The woman brought him coffee. It was good coffee. He drank it and did not say anything and she did not ask.`, DINER) },
    { id: 'carver', name: 'Raymond Carver', aka: 'dirty realism, minimalism',
      desc: 'Working-class lives, flat dialogue, small rooms, and endings that stop rather than resolve. Sadness without comment.',
      ref: '"What We Talk About When We Talk About Love", "Cathedral"',
      prompt: 'in the minimalist style of Raymond Carver: ordinary people, flat dialogue, small details, an ending that stops rather than resolves',
      ex: P(`"You want pie?" she said. "I don't know," he said. "What kind is it." She told him. He said he'd think about it. Then he just sat there, thinking about it.`, DINER) },
    { id: 'mccarthy', name: 'Cormac McCarthy', aka: 'biblical Western, no quotation marks',
      desc: 'No quotation marks, long "and"-chained sentences of landscape, archaic and technical vocabulary, sudden violence, terse dialogue.',
      ref: '"Blood Meridian", "The Road", "No Country for Old Men"',
      prompt: 'in the style of Cormac McCarthy: no quotation marks, long sentences chained with "and", stark landscape, terse dialogue',
      ex: P(`He came in out of the dark and the rain on him and he stood a long time in the door. Coffee, he said. She poured it. Where you headed. He looked at the window and the black road beyond it. North, he said.`, DINER) },
    { id: 'didion', name: 'Joan Didion', aka: 'cool essayist, New Journalism',
      desc: 'Cool, exact, first person, with the writer\'s anxiety visible under the control. Short declaratives, deliberate repetition, telling details of California and dread.',
      ref: '"Slouching Towards Bethlehem", "The White Album"',
      prompt: 'in the style of Joan Didion: cool and exact first person, short declaratives, telling details, controlled unease',
      ex: P(`It was June, and the diner on the county road was nearly empty. I remember the man's suitcase. I remember that it was tan leather, and that it did not belong there, and that I wrote this down without knowing why.`, DINER) },
    { id: 'chandler', name: 'Raymond Chandler', aka: 'hard-boiled detective',
      desc: 'First-person private eye with wisecracking, elaborate similes and moral exhaustion under the jokes.',
      ref: '"The Big Sleep", "Farewell, My Lovely"',
      prompt: 'in the style of Raymond Chandler: wisecracking first-person detective, elaborate similes, weary moral center',
      ex: P(`He came in looking like a man who'd lost an argument with the weather and was planning a rematch. The coffee was the color of a bad decision. I drank it anyway.`, DINER) },
    { id: 'dfw', name: 'David Foster Wallace', aka: 'maximalist, footnotes, hyper-self-aware',
      desc: 'Long, digressive sentences, academic words next to slang, self-aware qualifications, and footnotes that argue with the main text.',
      ref: '"Infinite Jest", "A Supposedly Fun Thing I\'ll Never Do Again"',
      prompt: 'in the style of David Foster Wallace: long self-aware digressive sentences, high and low vocabulary mixed, a footnote that argues with the text',
      ex: P(`The stranger, who was (and this is relevant, or at least it felt relevant at the time) carrying a suitcase of the sort of tan calfskin one associates with either inheritance or fraud, ordered coffee.<sup>1</sup><br><span style="font-size:.85em">1. Black. Obviously black.</span>`, DINER) },
    { id: 'thompson', name: 'Hunter S. Thompson', aka: 'gonzo journalism',
      desc: 'The writer is the main character, manic, paranoid and funny, with wild exaggeration and moral fury.',
      ref: '"Fear and Loathing in Las Vegas"',
      prompt: 'in a gonzo style like Hunter S. Thompson: the writer at the center, manic and paranoid, wild exaggeration, savage humor',
      ex: P(`We were somewhere around the pie case when the stranger came in, and I knew instantly he was a federal agent or a Baptist, possibly both, and that the waitress was in on it.`, DINER) },
    { id: 'vonnegut', name: 'Kurt Vonnegut', aka: 'dark comic, "so it goes"',
      desc: 'Very short chapters and sentences, plain words, dark subjects told with gentle absurdist humor and refrains.',
      ref: '"Slaughterhouse-Five", "Cat\'s Cradle"',
      prompt: 'in the style of Kurt Vonnegut: very short plain sentences, gentle absurdist humor about dark things, a repeated refrain',
      ex: P(`A man came into the diner. He was carrying a suitcase full of nothing, as it turned out. He would be dead by Thursday. So it goes. The pie was cherry.`, DINER) },
    { id: 'morrison', name: 'Toni Morrison', aka: 'lyrical, communal, mythic realism',
      desc: 'Musical, layered prose that moves through time and community memory, with the supernatural treated as ordinary.',
      ref: '"Beloved", "Song of Solomon", "Sula"',
      prompt: 'in a lyrical, mythic style like Toni Morrison: musical layered sentences, community memory, the uncanny treated as ordinary',
      ex: P(`The women at the Moonlite would say later that the stranger brought the rain in with him, folded in that suitcase like Sunday linen, and that the coffee tasted of it for a week.`, DINER) },
    { id: 'leguin', name: 'Ursula K. Le Guin', aka: 'clear-voiced speculative fiction',
      desc: 'Clear, calm, anthropological prose; strange worlds described with plain precision and moral seriousness.',
      ref: '"A Wizard of Earthsea", "The Left Hand of Darkness", "The Ones Who Walk Away from Omelas"',
      prompt: 'in the style of Ursula K. Le Guin: calm, clear, anthropological, the strange described plainly and with moral weight',
      ex: P(`In that country it was the custom to give a stranger coffee before asking his name. The woman at the counter followed the custom. The stranger, who knew it too, did not offer his name, and she understood what that meant.`, DINER) },
    { id: 'wodehouse', name: 'P. G. Wodehouse', aka: 'comic English farce',
      desc: 'Effervescent comic prose: elaborate similes, Edwardian slang, absurd understatement, and perfect sentence rhythm.',
      ref: 'Jeeves and Wooster, Blandings Castle',
      prompt: 'in the comic style of P. G. Wodehouse: buoyant elaborate similes, genteel slang, absurd understatement',
      ex: P(`The chap shimmered in like a damp heron with a grievance, and the waitress, a woman of considerable presence, regarded him as one regards a beetle in the soup: with interest, but no warmth.`, DINER) },
    { id: 'pratchett', name: 'Terry Pratchett', aka: 'comic fantasy, footnoted satire',
      desc: 'Warm satirical fantasy with jokes in every line, footnotes, and a big humane heart. Treats the absurd as logical.',
      ref: 'Discworld',
      prompt: 'in the style of Terry Pratchett: warm satirical wit, the absurd treated logically, humane underneath',
      ex: P(`The stranger had the look of a man who'd been told the end of the world was nigh and had come to check the menu first. It was a sensible precaution. The pie at the Moonlite was, in many respects, also the end of the world.`, DINER) },
    { id: 'austen', name: 'Jane Austen', aka: 'Regency irony, social comedy',
      desc: 'Elegant, balanced sentences, ironic narrator, free indirect style, and sharp social judgment under perfect manners.',
      ref: '"Pride and Prejudice", "Emma"',
      prompt: 'in the style of Jane Austen: balanced ironic sentences, polite surface, sharp social judgment, free indirect style',
      ex: P(`It is a truth universally acknowledged that a single man in possession of a good suitcase must be in want of an explanation, and the regulars of the Moonlite were determined he should give one.`, DINER) },
    { id: 'marquez', name: 'Gabriel García Márquez', aka: 'magical realism',
      desc: 'Long, flowing sentences that move across decades, with the miraculous reported in the same calm voice as the ordinary.',
      ref: '"One Hundred Years of Solitude", "Love in the Time of Cholera"',
      prompt: 'magical realism in the style of García Márquez: long flowing sentences spanning years, the miraculous told as ordinary fact',
      ex: P(`Many years later, as she poured the last cup of coffee the Moonlite would ever serve, Dolores would remember the night the stranger came in and every clock in the diner stopped at a quarter to twelve, and stayed that way until the spring.`, DINER) },
    { id: 'orwell', name: 'George Orwell', aka: 'plain style, political clarity',
      desc: 'Window-pane prose: clear, concrete, unadorned, and morally direct. His six rules are still the best short writing advice.',
      ref: '"Politics and the English Language", "Shooting an Elephant"',
      prompt: 'in Orwell\'s plain style: clear and concrete, short words, no worn-out metaphors, morally direct',
      ex: P(`The man came in at about midnight. He was tired and hungry and, I think, frightened. He ordered coffee and paid with coins he counted twice. Nobody spoke to him, and he did not expect anyone to.`, DINER) },
    { id: 'sedaris', name: 'David Sedaris', aka: 'humorous personal essay',
      desc: 'Self-deprecating first-person essays with deadpan family comedy and a sudden tender turn.',
      ref: '"Me Talk Pretty One Day", "Naked"',
      prompt: 'in the style of David Sedaris: self-deprecating first person, deadpan observational comedy, a sudden tender turn',
      ex: P(`My mother, who believed any man with luggage was either a salesman or a murderer, made us switch booths. "Just in case," she said, then spent the rest of dinner trying to catch his eye.`, DINER) }
  ]
});

pool.groups.push({
  id: 'pubs', title: 'Publications & brand voices', slot: 'Style reference',
  intro: 'House styles you can borrow. Each sample is a pastiche written for this page.',
  terms: [
    { id: 'newyorker', name: 'The New Yorker', aka: 'Talk of the Town, longform magazine',
      desc: 'Wry, literate and patient, with precise detail, long sentences, and an amused distance. Comfortable spending a paragraph on a minor character.',
      prompt: 'in a New Yorker voice: wry and literate, precise detail, patient long sentences, amused distance',
      ex: P(`The other morning, at a diner on Route 9 that has served the same cherry pie since the Eisenhower administration, a man in a grey overcoat ordered black coffee and declined, politely but firmly, to discuss his suitcase.`) },
    { id: 'economist', name: 'The Economist', aka: 'house style, unsigned analysis',
      desc: 'Confident, unsigned, British, brisk and witty, with punning headlines, crisp explanation, and a clear opinion in the last paragraph.',
      ref: 'The Economist Style Guide',
      prompt: 'in The Economist\'s house style: brisk, confident, lightly witty, crisp explanations, a firm conclusion',
      ex: P(`<b>Pedal power</b><br>Small towns are discovering what Copenhagen knew in the 1970s: bike lanes are cheap, popular and, eventually, good for shopkeepers. Elmtown should not be the last to notice.`) },
    { id: 'ap', name: 'Wire / AP style', aka: 'hard news, Associated Press',
      desc: 'Neutral, factual, inverted pyramid, attribution on every claim, numbers and dates in house format. No adjectives that carry opinion.',
      ref: 'AP Stylebook',
      prompt: 'in AP wire style: neutral and factual, inverted pyramid, every claim attributed, no opinionated adjectives',
      ex: P(`ELMTOWN, Ohio (AP) — The town council voted 4-1 Tuesday to install 4 miles of protected bike lanes, officials said. Construction is expected to begin in September.`) },
    { id: 'onion', name: 'The Onion', aka: 'satirical news',
      desc: 'Absurd premises reported in a perfectly straight AP news voice, with deadpan quotes from ordinary people.',
      prompt: 'satirical news in the style of The Onion: an absurd premise reported in a straight wire-news voice, deadpan quotes',
      ex: P(`<b>Local Man Who Has Not Ridden Bike Since 1994 Has Strong Opinions On Bike Lane Width</b><br>ELMTOWN — "Eighteen inches too wide, minimum," said Gary Pruitt, 58.`) },
    { id: 'mcsweeneys', name: 'McSweeney\'s', aka: 'Internet Tendency, absurdist humor list',
      desc: 'Literary absurdist humor, often in a borrowed format (a memo, a list, a review) taken to ridiculous extremes.',
      prompt: 'McSweeney\'s-style humor: an absurd premise in a borrowed format like a memo or list, escalating with a straight face',
      ex: P(`<b>Reasons My Neighbor Gave at the Town Hall Meeting for Opposing the Bike Lane, Ranked</b><br>4. Parking.<br>3. "The children."<br>2. A dream he had.<br>1. His horse.`) },
    { id: 'wirecutter', name: 'Wirecutter', aka: 'service journalism, product review',
      desc: 'Calm, thorough, helpful: the pick first, then why, then the tests, then who should get something else. Trust earned through method.',
      prompt: 'in Wirecutter\'s service-journalism style: the recommendation first, then why, how we tested, and who should choose something else',
      ex: P(`<b>Our pick:</b> the Brompton C Line. After 140 miles of commuting tests, it folded fastest, rode most like a full-size bike, and fit under a café table. If you have stairs, get the lighter P Line instead.`) },
    { id: 'newsletter', name: 'Morning newsletter', aka: 'Morning Brew, Axios Smart Brevity',
      desc: 'Bold lead-ins, bullet-point "why it matters", one joke per section, ruthless brevity. Axios codified it as "Smart Brevity".',
      ref: 'Axios "Smart Brevity" (VandeHei, Allen, Schwartz), Morning Brew',
      prompt: 'in Axios Smart Brevity style: bold one-line lead, "Why it matters", a few short bullets, nothing else',
      ex: P(`<b>Elmtown goes two-wheeled.</b><br><b>Why it matters:</b> It's the state's first protected lane network outside a city.<br><b>By the numbers:</b> 4 miles, $1.2M, 1 very upset hardware store.`) },
    { id: 'apple', name: 'Apple product copy', aka: 'keynote voice',
      desc: 'Short, confident, rhythmic lines; one big claim per screen; superlatives made specific; wordplay in headlines.',
      prompt: 'in the style of Apple product copy: short confident rhythmic lines, one big claim, specific superlatives, a wordplay headline',
      ex: hero(`Light. Years ahead.`, `The new trail bike weighs 9.2 kg. Carbon frame. All-day battery. Folds in three seconds.`, [['Learn more', 'p'], ['Buy']]) },
    { id: 'patagonia', name: 'Patagonia', aka: 'activist brand, mission-first',
      desc: 'Earnest, outdoorsy, unafraid to argue against its own sales. Activism and craftsmanship ahead of product features.',
      prompt: 'in Patagonia\'s voice: earnest and outdoorsy, mission before product, willing to tell people to buy less',
      ex: P(`Don't buy this jacket if your old one still works. Bring it in. We'll fix the zipper, patch the elbow and send you back out into the weather.`) },
    { id: 'mailchimp', name: 'Mailchimp', aka: 'friendly expert, content style guide',
      desc: 'Plainspoken, genuine, translator of jargon, with dry humor that steps aside when the user is stressed. Their public voice and tone guide is a classic.',
      ref: 'styleguide.mailchimp.com',
      prompt: 'in Mailchimp\'s voice: plainspoken, genuine, a little dry humor, translating jargon, serious when the user is stressed',
      ex: dlg(`High five! Your campaign is on its way.`, `It's going to 2,184 subscribers. We'll send you a report in 24 hours.`, [['View report', 'p']]) },
    { id: 'oatly', name: 'Oatly / Innocent', aka: 'chatty packaging, back-of-carton voice',
      desc: 'Rambling, self-aware, conversational copy on the packaging itself, talking directly to whoever bothered to read it.',
      prompt: 'chatty packaging copy like Oatly or Innocent: self-aware, rambling, talking directly to whoever is reading the carton',
      ex: P(`Hey, you're reading the side of a carton. We respect that. Honestly, there's not much else to say. It's oats and water. Okay, bye. Actually wait, recycle this. Okay, bye for real.`) },
    { id: 'basecamp', name: 'Basecamp / 37signals', aka: 'opinionated plain-talk',
      desc: 'Blunt, opinionated, anti-corporate, short paragraphs that pick a fight with industry norms.',
      ref: '"Rework", "It Doesn\'t Have to Be Crazy at Work"',
      prompt: 'in the 37signals style: blunt and opinionated, short paragraphs, challenge industry norms directly',
      ex: P(`Most project tools are built for managers who want to watch. Ours is built for people who want to work. That's it. That's the difference.`) },
    { id: 'stripe', name: 'Stripe docs', aka: 'developer documentation gold standard',
      desc: 'Precise, calm, example-led. Tells you what you\'ll build, gives working code early, explains just enough.',
      prompt: 'in the style of Stripe\'s docs: precise and calm, state what the reader will build, working example early, just enough explanation',
      ex: mono(`<span class="c"># Accept a payment</span>\nCreate a PaymentIntent on your server\nwith an amount and currency.\n\n<span class="k">curl</span> https://api.example.com/v1/payment_intents \\\n  -d amount=2000 -d currency=usd`) }
  ]
});
/* ===== Formats ===== */
pool.groups.push({
  id: 'ux', title: 'UX microcopy', slot: 'Format',
  intro: 'The small words in interfaces. Each card shows a mock of the real thing.',
  terms: [
    { id: 'errormsg', name: 'Error message', aka: 'validation message, error state',
      desc: 'Says what went wrong, why, and how to fix it, in that order, without blame or apology theater. Puts the fix next to the problem.',
      ref: 'NN/g error message guidelines, Material Design writing',
      prompt: 'write an error message that says what happened, why, and exactly how to fix it, without blaming the user',
      ex: field('Card number', '4242 4242 4242', 'This number is 12 digits. Card numbers are usually 16. Check the front of your card.') },
    { id: 'emptystate', name: 'Empty state', aka: 'zero state, first-run screen',
      desc: 'What a screen says before there\'s anything on it. Explains what will appear here and gives one action to start.',
      prompt: 'write an empty state: what will appear here, why it\'s useful, and one clear action to start',
      ex: `<div class="m m-card m-ctr"><div class="m-h">No trips yet</div><div class="m-b">Trips you save show up here, with maps and packing lists.</div><span class="m-btn p">Plan a trip</span></div>` },
    { id: 'buttons', name: 'Button labels', aka: 'CTAs, action labels',
      desc: 'Start with a verb that says exactly what happens. "Delete 3 photos" beats "OK"; "Save draft" beats "Submit".',
      prompt: 'write button labels as specific verbs that say exactly what happens ("Delete 3 photos", not "OK")',
      ex: `<div class="m m-row" style="justify-content:center"><span class="m-btn"><s class="cut">OK</s></span><span class="m-btn"><s class="cut">Submit</s></span></div><div class="m m-row" style="justify-content:center;margin-top:6px"><span class="m-btn">Keep editing</span><span class="m-btn p">Publish post</span></div>` },
    { id: 'confirm', name: 'Confirmation dialog', aka: 'destructive action dialog, "are you sure"',
      desc: 'Names the exact action and its consequence, with the button repeating the verb. Never "Are you sure?" with OK/Cancel.',
      prompt: 'write a confirmation dialog: title names the action, body states the consequence, buttons repeat the verb',
      ex: dlg(`Delete "Summer Tour" playlist?`, `This removes it for everyone you shared it with. You can't undo this.`, [['Cancel'], ['Delete playlist', 'd']]) },
    { id: 'toastmsg', name: 'Success toast', aka: 'snackbar, confirmation message',
      desc: 'Past tense, a few words, an Undo when possible. Confirms the thing happened without celebrating it.',
      prompt: 'write a success toast: past tense, a few words, offer Undo where possible',
      ex: toast('Archived 3 messages', 'Undo') },
    { id: 'onboard', name: 'Onboarding tip', aka: 'coach mark, tooltip, walkthrough',
      desc: 'One idea per tip: what it is, why you\'d use it. Lets you skip.',
      prompt: 'write an onboarding tip: one idea, what it does and why it helps, in under 20 words, with a skip option',
      ex: dlg(`Swipe to save for later`, `Saved songs download automatically, so they play even without signal.`, [['Skip'], ['Got it', 'p']]) },
    { id: 'fourohfour', name: '404 page', aka: 'not found page',
      desc: 'Says the page isn\'t here, possibly why, and gives a way forward. A good place for a little personality.',
      prompt: 'write a 404 page: say the page isn\'t here, a light touch of personality, and two useful ways forward',
      ex: `<div class="m m-ctr"><div class="m-big">404</div><div class="m-h">This trail doesn't go anywhere.</div><div class="m-b">The page may have moved, or the link has a typo.</div><div class="m-row"><span class="m-btn p">Back to the map</span><span class="m-btn">Search</span></div></div>` },
    { id: 'pushnote', name: 'Push notification', aka: 'notification copy',
      desc: 'A title that makes sense alone, and a body that adds the one detail that matters. Personal, timely, under 100 characters.',
      prompt: 'write a push notification: a title that stands alone, one useful detail in the body, under 100 characters',
      ex: push('Ferry', 'Your 7:00 crossing is boarding', 'Gate B. Fog has cleared, sailing on time.', '6:41') },
    { id: 'hint', name: 'Helper text', aka: 'form hint, placeholder, field help',
      desc: 'Answers the question someone would ask about a field before they get it wrong: format, why we need it, what happens with it.',
      prompt: 'write helper text that answers the question a person would have about this field before they make a mistake',
      ex: `<div class="m m-card" style="gap:5px"><div class="m-lbl">Phone number</div><div class="m-in" style="border-color:var(--line)">(555) 014-2210</div><div class="m-hint">We'll only text you if your ferry is delayed.</div></div>` },
    { id: 'loading', name: 'Loading message', aka: 'progress text, wait copy',
      desc: 'Says what\'s happening and roughly how long. Rotating jokes are fine once; honest progress is better.',
      prompt: 'write loading text that says what is happening and how long it might take',
      ex: `<div class="m m-card"><div class="m-row"><span class="m-spin"></span><b>Building your playlist</b></div><div class="m-b">Matching 214 songs. This usually takes under a minute.</div></div>` }
  ]
});

pool.groups.push({
  id: 'product', title: 'Product & developer writing', slot: 'Format',
  intro: 'Writing that ships with software: notes, docs, status and code history.',
  terms: [
    { id: 'releasenotes', name: 'Release notes', aka: 'what\'s new, app store update text',
      desc: 'What changed, in terms of what the reader can now do. Leads with the best change, groups the rest, skips internal jargon.',
      prompt: 'write release notes: lead with the most useful change in user terms, then grouped smaller changes and fixes',
      ex: `<div class="m m-card"><div class="m-h">Version 4.2</div><ul class="m-ul"><li><span class="m-tag">New</span>Offline maps. Download a whole park before you go.</li><li><span class="m-tag g">Better</span>Routes now avoid closed trails.</li><li><span class="m-tag g">Fixed</span>Elevation no longer shows in meters when set to feet.</li></ul></div>` },
    { id: 'changelog', name: 'Changelog', aka: 'Keep a Changelog, CHANGELOG.md',
      desc: 'Dated, versioned, grouped under Added, Changed, Deprecated, Removed, Fixed and Security. Written for developers and machines both.',
      ref: 'keepachangelog.com, Semantic Versioning',
      prompt: 'write a changelog entry in Keep a Changelog format: version, date, and Added/Changed/Fixed sections',
      ex: mono(`<span class="k">## [2.4.0]</span> - 2026-10-15\n<span class="k">### Added</span>\n- Offline map downloads\n<span class="k">### Fixed</span>\n- Elevation unit setting ignored`) },
    { id: 'incident', name: 'Incident update', aka: 'status page post, outage notice',
      desc: 'What\'s affected, what we know, what we\'re doing, when the next update comes. Timestamped, plain, no spin.',
      prompt: 'write a status page incident update: what\'s affected, what we know, what we\'re doing, and when the next update will be',
      ex: P(`<b>Investigating</b> · 14:05 UTC<br>Some users can't download offline maps. Navigation and saved maps still work. We've found the cause and are rolling out a fix. Next update by 14:45.`) },
    { id: 'readme', name: 'README', aka: 'project readme',
      desc: 'One line on what it is, why you\'d want it, a quick start that works, then everything else. The first five lines decide whether anyone tries it.',
      prompt: 'write a README: one-line description, why it\'s useful, a copy-paste quick start, then details',
      ex: mono(`<span class="k"># trailhead</span>\nOffline trail maps for the command line.\n\n<span class="k">## Quick start</span>\nnpm i -g trailhead\ntrailhead get "Yosemite"`) },
    { id: 'commit', name: 'Commit message', aka: 'git commit, conventional commits',
      desc: 'An imperative summary under about 50 characters, a blank line, then why the change was made. Conventional Commits adds a type prefix.',
      ref: 'Chris Beams "How to Write a Git Commit Message", conventionalcommits.org',
      prompt: 'write a commit message: imperative summary under 50 characters, blank line, then a body explaining why',
      ex: mono(`<span class="k">fix(maps):</span> respect elevation unit setting\n\nThe profile chart read the server default\ninstead of the user's choice, so feet users\nsaw meters on downloaded maps.`) },
    { id: 'howto', name: 'How-to guide', aka: 'task docs, procedure',
      desc: 'Goal in the title, prerequisites, numbered steps that each start with a verb, and what you should see when it worked.',
      prompt: 'write a how-to guide: goal as the title, prerequisites, numbered verb-first steps, and how to confirm it worked',
      ex: P(`<b>Download a map for offline use</b><br>1. Open the park page.<br>2. Tap <b>Download</b>.<br>3. Choose a detail level.<br>When it's done, a check mark appears on the map card.`) },
    { id: 'prdesc', name: 'PR description', aka: 'pull request summary',
      desc: 'What changed and why, how to test it, and anything a reviewer should look at carefully. Screenshots for UI.',
      prompt: 'write a pull request description: what changed and why, how to test it, and what reviewers should check closely',
      ex: P(`<b>Before:</b> Offline maps showed meters even when you'd chosen feet.<br><b>After:</b> They follow your setting.<br><b>Test:</b> Set units to feet, download a park, open the elevation chart.`) },
    { id: 'apiref', name: 'API reference', aka: 'reference docs',
      desc: 'Exhaustive, consistent and terse: every parameter, its type, default and an example. No narrative.',
      prompt: 'write API reference entries: every parameter with type, default, and a short description, plus one example',
      ex: mono(`<span class="k">GET</span> /maps/{park_id}\n\n<span class="c">park_id</span>   string   required\n<span class="c">detail</span>    enum     low | high (default low)\n<span class="c">units</span>     enum     m | ft (default m)`) }
  ]
});

pool.groups.push({
  id: 'marketing', title: 'Marketing & announcements', slot: 'Format',
  intro: 'Formats that sell, announce or persuade, from six words to a page.',
  terms: [
    { id: 'tagline', name: 'Tagline', aka: 'slogan, strapline',
      desc: 'A few words that capture the brand or product, memorable enough to repeat. Rhythm and one image beat a list of benefits.',
      prompt: 'write taglines: under six words, rhythmic, one image or idea, memorable enough to repeat',
      ex: P(`Go where the signal doesn't.`, B('Brief', 'offline trail maps'), 'xl') },
    { id: 'herohead', name: 'Hero headline', aka: 'landing page headline, H1 + subhead',
      desc: 'A headline that says the outcome, a subhead that says how, and one button. Clarity beats cleverness above the fold.',
      prompt: 'write a landing page hero: a headline that names the outcome, a subhead that says how, and one button label',
      ex: hero(`Every trail, even without signal.`, `Download whole parks in one tap and navigate offline with your phone's GPS.`, [['Get the app', 'p']]) },
    { id: 'productdesc', name: 'Product description', aka: 'PDP copy, item description',
      desc: 'Who it\'s for, what it does, the details that matter, and one sensory or story line that makes it wanted.',
      prompt: 'write a product description: who it\'s for, what it does, the key specs, and one sensory line that makes it desirable',
      ex: P(`<b>Waxed canvas field jacket</b><br>Built for wet ferry decks and long dog walks. Waxed cotton sheds rain, the flannel lining keeps the chill out, and it gets better every year you wear it. Four pockets, one big enough for a paperback.`) },
    { id: 'newsletter2', name: 'Email newsletter', aka: 'creator newsletter, Substack post',
      desc: 'Personal subject line, a warm first line, one main story, a couple of links, a sign-off with a name.',
      prompt: 'write an email newsletter: personal subject line, warm opening, one main story, a few links, signed with a name',
      ex: mail('Juniper Trail Co.', 'The fog came in early this year', `Hi friend, the lake has been under a white blanket all week, and honestly we've been loving it. Here's what's new at the shop...`) },
    { id: 'coldemail', name: 'Cold email', aka: 'outreach email, pitch email',
      desc: 'Short: who you are, why them specifically, one clear ask, an easy yes. Under 120 words.',
      prompt: 'write a cold email under 120 words: why this person specifically, one clear ask, an easy way to say yes',
      ex: mail('Sam Ortiz', 'Your Route 9 photos', `Hi Ana, your fog photos from Route 9 are the best I've seen of that road. I'm putting together a small print zine about it. Could I use two of them, with credit and a copy for you?`) },
    { id: 'socialpost', name: 'Social post', aka: 'tweet, Threads, Bluesky, LinkedIn post',
      desc: 'The hook in the first line, one idea, written to be read in a feed. Thread form if it really needs more room.',
      prompt: 'write a social post: hook in the first line, one idea, short enough to read in the feed',
      ex: post('Juniper Trail Co.', '@junipertrail', `Fog so thick this morning the dog walked us. New waxed jackets in store Friday.`) },
    { id: 'press', name: 'Press release', aka: 'news release, announcement',
      desc: 'Dateline, a headline that is news, the who-what-when in the first paragraph, a quote that says something, boilerplate at the end.',
      prompt: 'write a press release: newsworthy headline, dateline, key facts in the first paragraph, one real quote, boilerplate',
      ex: P(`<b>Elmtown Opens State's First Rural Protected Bike Network</b><br>ELMTOWN, OHIO, Sept. 6, 2026 — Elmtown today opened 4 miles of protected bike lanes connecting all three of its schools...`) },
    { id: 'appstore', name: 'App store description', aka: 'store listing',
      desc: 'The first line has to sell it because it\'s all most people see. Then short scannable benefits.',
      prompt: 'write an app store description: a first line that sells it alone, then short scannable benefits',
      ex: P(`Trail maps that work with zero bars.<br>• Download entire parks in one tap<br>• Live GPS position, no signal needed<br>• Elevation, water and campsite layers`) },
    { id: 'casestudy', name: 'Case study', aka: 'customer story',
      desc: 'The customer as hero: their situation, the problem, what they tried, how it went, with specific numbers and a quote.',
      prompt: 'write a customer case study: the customer\'s situation, problem, solution and results with specific numbers and a quote',
      ex: P(`When Pine Lake Outfitters lost cell service on their guided routes, guides carried paper maps in ziplock bags. After switching to offline maps, lost-guest calls dropped from 11 a season to zero.`) }
  ]
});

pool.groups.push({
  id: 'longform', title: 'Long-form & creative', slot: 'Format',
  intro: 'Essays, stories and the in-between forms: liner notes, bios, placards, headnotes. Several lean toward music and folk, for the gallery work.',
  terms: [
    { id: 'essay', name: 'Personal essay', aka: 'creative nonfiction, memoir essay',
      desc: 'A true story from the writer\'s life that turns outward to an idea. Concrete scenes, honest reflection, an ending that doesn\'t tie a bow.',
      prompt: 'write a personal essay: a true scene from the writer\'s life, honest reflection that turns outward to a larger idea, no neat bow',
      ex: P(`My father taught me to ride on Route 9, in a summer when it was still safe to. He ran beside me for a mile, holding the seat. I didn't know until years later that he'd let go after the first hundred feet.`) },
    { id: 'oped', name: 'Op-ed', aka: 'opinion piece, column',
      desc: 'One clear argument stated early, evidence, the strongest counterargument answered, a call to act. About 750 words.',
      prompt: 'write an op-ed: state one argument early, support it with evidence, answer the strongest objection, end with a call to act',
      ex: P(`Elmtown's council has a chance on Tuesday to save lives for $1.2 million, most of it paid by the state. It should take it. Opponents say we'll lose parking. We'll lose 40 spaces. We lost a 12-year-old's leg last spring.`) },
    { id: 'explainer', name: 'Explainer', aka: 'what you need to know',
      desc: 'Answers "what is this and why should I care" for a newcomer, building from simple to complex, defining every term.',
      ref: 'Vox, the BBC\'s "What we know so far"',
      prompt: 'write an explainer: what it is, why it matters now, and how it works, for a smart newcomer, defining every term',
      ex: P(`<b>What's a protected bike lane?</b><br>It's a lane separated from cars by something physical: a curb, posts or parked cars. Painted lines alone don't count. Studies show the barrier is what makes people feel safe enough to ride.`) },
    { id: 'profile', name: 'Profile', aka: 'magazine profile, portrait piece',
      desc: 'A portrait of a person through scenes, details and what others say, with their own words carrying the voice.',
      prompt: 'write a profile: a person revealed through scenes, telling details, their own quotes and what others say about them',
      ex: P(`Gary Pruitt has run Pruitt Hardware for 31 years and has never, by his own count, lost an argument. He is about to lose one. "I'll admit it's a good-looking lane," he says, not admitting it at all.`) },
    { id: 'review', name: 'Review', aka: 'critique, criticism',
      desc: 'A clear verdict, the reasons, specific evidence, and context for who will love it and who won\'t.',
      prompt: 'write a review: a clear verdict early, specific evidence for it, and who will and won\'t like it',
      ex: P(`The new record is the band's quietest and its best: ten songs recorded live in a lake cabin, every creak of the floorboards left in. If you came for the anthems, you'll miss them. If you came for the fog, stay.`) },
    { id: 'liner', name: 'Liner notes', aka: 'album notes, sleeve notes',
      desc: 'The story behind a record: where it was made, who played, what it\'s about, in a voice somewhere between essay and campfire tale. Can be written in character.',
      ref: 'Bob Dylan\'s and Johnny Cash\'s sleeve notes, Lord Huron\'s in-world album lore',
      prompt: 'write liner notes: the story behind the record, where and how it was made, written warmly, optionally in character',
      ex: P(`These songs were caught over one long winter at a cabin on Pine Lake, where the radio only picked up one station and it only played at night. We left the windows open. You can hear the loons on track six.`) },
    { id: 'bio', name: 'Artist bio', aka: 'band bio, press bio, about',
      desc: 'Who they are in one line, what they sound like by comparison, the story, recent news. Short, long and one-liner versions.',
      prompt: 'write an artist bio: a one-line who-they-are, sound described by reference points, a short story, recent news',
      ex: P(`The Lakeshore Ramblers play cinematic folk for long drives at night: think Fleetwood Mac harmonies on a Morricone soundtrack. Formed in a Michigan bait shop in 2019, they've since played 212 shows in 37 states.`) },
    { id: 'toast', name: 'Speech or toast', aka: 'wedding toast, eulogy, talk',
      desc: 'Written for the ear: short sentences, one story, a callback, a raise of the glass. Under three minutes.',
      prompt: 'write a speech meant to be heard: short sentences, one story, a callback, a clear ending line, under three minutes',
      ex: P(`I've known Dana since she was nine and tried to sell me my own bike. Tonight she's marrying the only person who ever talked her out of a deal. To Dana and Sam: may every bargain be this good.`) },
    { id: 'flash', name: 'Flash fiction', aka: 'micro fiction, short-short story',
      desc: 'A complete story in under 1,000 words, often under 300. Starts late, leaves early, every word carrying weight.',
      prompt: 'write flash fiction under 300 words: start late, leave early, a complete arc with one turn',
      ex: P(`Every night at 11:50 the light came on across the lake. Every night my grandfather rowed out toward it and came back at dawn with nothing to say. The night he died, the light didn't come on. The next night, it did, and it was closer.`) },
    { id: 'prosepoem', name: 'Prose poem', aka: 'poem in paragraphs',
      desc: 'Poetry\'s compression, imagery and leaps, written as a paragraph without line breaks.',
      ref: 'Charles Simic, Claudia Rankine, Baudelaire',
      prompt: 'write a prose poem: one compressed paragraph with poetic imagery and leaps, no line breaks',
      ex: P(`The highway at night is a long sentence nobody finishes. The motels are commas. Somewhere in Nebraska my father is still driving, the radio between stations, saying the names of the towns out loud so they'll know he passed.`, '', 'i') },
    { id: 'pulpblurb', name: 'Pulp paperback blurb', aka: 'back-cover copy, dime novel teaser',
      desc: 'Breathless back-cover copy from a 1950s paperback: lurid adjectives, a dangerous stranger, a question, an exclamation point. Great for album concepts and in-world lore.',
      ref: 'Gold Medal paperbacks, Lord Huron\'s George Ranger Johnson novels',
      prompt: 'write pulp paperback back-cover copy: breathless 1950s style, lurid adjectives, a dangerous stranger, ending on a question',
      ex: `<div class="pulp"><div class="slab">A Tin Star Western · 35¢</div><div class="smp">HE CAME FROM NOWHERE WITH A SUITCASE FULL OF SECRETS. She was a waitress with nothing left to lose. And out on the black lake, something was waiting for them both... Can love outrun THE STRANGE LIGHT?</div></div>` },
    { id: 'placard', name: 'Museum placard', aka: 'wall label, exhibit text',
      desc: 'Title, maker, date and medium, then 50 to 100 words on what to look at and why it matters. Assumes curiosity, not expertise.',
      prompt: 'write a museum wall label: title, maker, date and medium, then under 100 words on what to notice and why it matters',
      ex: `<div class="placard"><div class="t">Lantern, Pine Lake Ferry</div><div class="m2">Unknown maker · c. 1910 · tin, glass, whale oil</div><div class="smp" style="font-size:14px">Ferrymen hung this lantern at the bow on foggy nights. Look for the dents on the left side: local legend says they came from the night of the 1923 storm.</div></div>` },
    { id: 'headnote', name: 'Recipe headnote', aka: 'cookbook intro',
      desc: 'The short story above a recipe: where it comes from, what makes it work, one tip. A sentence or two, not a memoir.',
      prompt: 'write a recipe headnote: where it comes from, what makes it work, one practical tip, in under 80 words',
      ex: P(`<b>Moonlite Diner Cherry Pie</b><br>Dolores made this every night from 1961 to 2019, and never wrote it down. This is our best reconstruction. The secret is a splash of almond extract and letting it cool fully, which nobody ever does.`) }
  ]
});

const G = Object.fromEntries(pool.groups.map(g => [g.id, g]));
const WORKBOOK = {};
WORKBOOK.areas = [
  { id: 'voices', title: 'Voices', preview: 'campfire', blurb: 'Who seems to be talking: everyday brand voices and bigger character voices, all carrying the same message so you can compare them.', groups: ['everyday', 'character'] },
  { id: 'tone', title: 'Tone & register', preview: 'wistful', blurb: 'The four tone dials, emotional tones for a single piece, and registers from ceremonial to plain language.', groups: ['dials', 'moods', 'register'] },
  { id: 'structure', title: 'Structure', preview: 'scqa', blurb: 'Openings, endings and named frameworks for a whole piece, from the inverted pyramid to kishōtenketsu.', groups: ['openings', 'frameworks'] },
  { id: 'devices', title: 'Rhetorical devices', preview: 'anaphora', blurb: 'Sentence-level moves, each highlighted in its sample: repetition and rhythm, contrast and turn, image and detail.', groups: ['repetition', 'turns', 'image'] },
  { id: 'styles', title: 'Styles & references', preview: 'mccarthy', blurb: 'Point of view and narration, writers to point at, and publication and brand voices to borrow.', groups: ['pov', 'authors', 'pubs'] },
  { id: 'formats', title: 'Formats', preview: 'confirm', blurb: 'UX microcopy, product and developer writing, marketing, and long-form and creative forms from essays to liner notes.', groups: ['ux', 'product', 'marketing', 'longform'] }
].map(a => ({ ...a, groups: a.groups.map(id => G[id]).filter(Boolean) })).filter(a => a.groups.length);

WORKBOOK.recipes = [
  { label: 'A 404 page', parts: [['A '], ['404 page', 'fourohfour'], [' for a hiking app in a '], ['warm', 'warm'], [', '], ['playful', 'playful'], [' voice. '], ['Casual', 'casual'], [' and a little '], ['funny', 'funny'], [', with one '], ['fresh metaphor', 'metaphor'], [', '], ['button labels', 'buttons'], [' that say exactly where they go, and '], ['plain language', 'plainlang'], [' for the help text.']] },
  { label: 'Liner notes for a folk record', parts: [['Liner notes', 'liner'], [' for a concept album, told by a '], ['campfire storyteller', 'campfire'], [' with a '], ['mythic frontier', 'mythic'], [' cadence and a '], ['wistful', 'wistful'], [' tone. Set it up as a '], ['frame story', 'frame'], [', include a '], ['found document', 'found'], [', lean on '], ['polysyndeton', 'polysyndeton'], [' and '], ['sensory detail', 'sensory'], [', and end on a '], ['circle-back', 'circleback'], [' to the opening image.']] },
  { label: 'Release notes', parts: [['Release notes', 'releasenotes'], [' in a '], ['plainspoken', 'plain'], [' voice with a '], ['matter-of-fact', 'matteroffact'], [' tone. '], ['Inverted pyramid', 'pyramid'], [' order, '], ['exact numbers', 'numbers'], [' over adjectives, '], ['parallel', 'isocolon'], [' bullet points, and no '], ['corporate-speak', 'corporate'], ['. A '], ['changelog', 'changelog'], [' for developers underneath.']] }
];

/* Same message, every voice: the facts stay fixed, the voice changes */
WORKBOOK.same = [
  { id: 'closing', label: 'Closing early', brief: 'The bookshop closes at 3 p.m. on Friday for a staff party. Normal hours Saturday.', lines: {
    plain: 'We\'re closing at 3 p.m. this Friday for a staff event. We\'ll be open as usual on Saturday from 9.',
    warm: 'Heads up: we\'re closing at 3 on Friday so the whole team can celebrate together. We\'ll see you bright and early Saturday at 9!',
    witty: 'Friday at 3 we\'re closing for a staff party, which for a bookshop means wine and arguing about Proust. Back Saturday at 9, slightly hoarse.',
    authoritative: 'Store hours, Friday: 9 a.m. to 3 p.m. Regular hours resume Saturday at 9 a.m.',
    deadpan: 'We will close at 3 on Friday. There is a party. Attendance is mandatory. Saturday we open at 9, as always.',
    lyrical: 'On Friday the lamps go off at three, the shelves get a long afternoon to themselves, and we go off to toast another year among the books. Saturday at nine, the door is yours again.',
    hardboiled: 'Friday, three o\'clock, the door gets locked and the lights go out. The staff has a party to get to. Come back Saturday at nine. The books will keep.',
    exuberant: 'PARTY TIME! We\'re closing at 3 on Friday to celebrate our amazing team! Back Saturday at 9, ready for you!'
  } },
  { id: 'payment', label: 'Payment failed', brief: 'A card payment for a subscription didn\'t go through. Nothing is lost yet; update the card within 7 days.', lines: {
    plain: 'Your payment didn\'t go through. Update your card within 7 days to keep your subscription.',
    warm: 'Looks like your last payment didn\'t go through. No stress, nothing\'s lost. Just update your card in the next 7 days and you\'re all set.',
    witty: 'Your card said no. We\'re not taking it personally. Update it in the next 7 days and we\'ll all pretend this never happened.',
    authoritative: 'Payment declined by your card issuer. Update your payment method within 7 days to avoid interruption of service.',
    deadpan: 'The payment did not work. The card was asked. The card declined. You have 7 days to introduce us to a different card.',
    lyrical: 'Your payment drifted off somewhere between the bank and us. There\'s still time: seven days to set it right, and nothing will change.',
    hardboiled: 'The card bounced. Happens to the best of us. You\'ve got seven days to square it before we have to close the account.',
    exuberant: 'Quick fix needed! Your payment didn\'t go through, but update your card in the next 7 days and you won\'t miss a thing!'
  } },
  { id: 'record', label: 'New record out', brief: 'The band\'s new album is out today on all platforms, with vinyl shipping next month.', lines: {
    plain: 'Our new album is out today on all streaming services. Vinyl ships next month.',
    warm: 'It\'s finally here. Our new album is out today everywhere, and the vinyl will be on your doorstep next month. Thank you for waiting with us.',
    witty: 'The new album is out today, which means we can finally stop pretending we\'re not refreshing the charts. Vinyl next month, for those who like to wait.',
    authoritative: 'The new album is available today on all major platforms. Vinyl editions ship in November.',
    deadpan: 'We made an album. It is out today. You can listen to it. In November there will also be a round version.',
    lyrical: 'Ten songs, written by lamplight on a lake that freezes in October, are out in the world tonight. Put them on for a long drive. The vinyl comes with the first snow.',
    hardboiled: 'The record dropped today. Ten songs, no filler, every one of them earned. The vinyl\'s on a slow boat. It\'ll land next month.',
    exuberant: 'IT\'S OUT!!! The new album is live everywhere RIGHT NOW. Vinyl ships next month. Turn it all the way up!'
  } }
];
WORKBOOK.sameVoices = ['plain', 'warm', 'witty', 'authoritative', 'deadpan', 'lyrical', 'hardboiled', 'exuberant'];

WORKBOOK.xcols = ['Voice', 'Tone', 'Structure', 'Devices', 'Point at'];
WORKBOOK.xlate = [
  { job: 'Errors & help text', note: 'apps, forms, support', cells: [['plain', 'reassuring'], ['matteroffact', 'empathetic'], ['bluf', 'faq'], ['concrete', 'isocolon'], ['mailchimp', 'stripe']] },
  { job: 'Landing page', note: 'products, launches', cells: [['confident', 'witty'], ['enthusiastic', 'casual'], ['aida', 'bab'], ['tricolon', 'antithesis'], ['apple', 'basecamp']] },
  { job: 'Release notes', note: 'apps, devtools', cells: [['plain', 'minimal'], ['matteroffact', 'casual'], ['pyramid', 'listicle'], ['numbers', 'isocolon'], ['stripe', 'newsletter']] },
  { job: 'Bad news', note: 'outages, closures, price rises', cells: [['plain', 'earnest'], ['apologetic', 'calm'], ['bluf', 'whatsowhat'], ['concrete', 'numbers'], ['ap', 'orwell']] },
  { job: 'Newsletter', note: 'brands, creators', cells: [['insider', 'warm'], ['casual', 'enthusiastic'], ['anecdote', 'listicle'], ['callback', 'variety'], ['newsletter', 'newyorker']] },
  { job: 'Personal essay', note: 'blogs, memoir', cells: [['wry', 'earnest'], ['wistful', 'tender'], ['braided', 'circleback'], ['showtell', 'sensory'], ['didion', 'sedaris']] },
  { job: 'Folk & Americana', note: 'liner notes, band copy', cells: [['campfire', 'mythic'], ['nostalgic', 'wistful'], ['frame', 'found'], ['polysyndeton', 'pathetic'], ['mccarthy', 'morrison']] },
  { job: 'Spooky fiction', note: 'stories, games, lore', cells: [['gothic', 'deadpan'], ['ominous', 'suspenseful'], ['medias', 'openloop'], ['aposiopesis', 'understatement'], ['leguin', 'unreliable']] },
  { job: 'Satire', note: 'humor sites, parody', cells: [['deadpan', 'sardonic'], ['funny', 'irreverenttone'], ['listicle', 'pyramid'], ['bathos', 'hyperbole'], ['onion', 'mcsweeneys']] },
  { job: 'Persuasion', note: 'op-eds, proposals, pitches', cells: [['authoritative', 'manifesto'], ['urgent', 'hopeful'], ['scqa', 'minto'], ['anaphora', 'rhetq'], ['economist', 'orwell']] },
  { job: 'Teaching', note: 'docs, tutorials, courses', cells: [['mentor', 'curious'], ['casual', 'reassuring'], ['diataxis', 'faq'], ['extmetaphor', 'concrete'], ['stripe', 'leguin']] }
];
WORKBOOK.lens = ['One line', 'Under 50 words', 'About 150 words', 'About 500 words', 'About 1,500 words', '3 options to choose from'];


/* ---------- rendering ---------- */
const $ = s => document.querySelector(s);
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const store = {
  get(k, d) { try { const v = localStorage.getItem(k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { } }
};
const picks = new Set(store.get('vt-picks', []));
let fmt = store.get('vt-fmt', 'request');
let msgId = store.get('vt-msg', 'closing');
const TERMS = {};
WORKBOOK.areas.forEach(a => a.groups.forEach(g => g.terms.forEach(t => TERMS[t.id] = { t, g, a })));
// the table and recipes use a couple of friendly aliases
TERMS.understatement = TERMS.meiosis;
const totalTerms = new Set(Object.values(TERMS).map(x => x.t.id)).size;
let pendingJump = null;

const cardHTML = (t, g) => `
  <article class="card${picks.has(t.id) ? ' picked' : ''}" id="t-${t.id}" data-search="${esc((t.name + ' ' + (t.aka || '') + ' ' + t.desc + ' ' + (t.ref || '') + ' ' + (t.hear || '') + ' ' + g.title).toLowerCase())}">
    <div class="ex">${t.ex}</div>
    <div class="cbody">
      <h3>${esc(t.name)}</h3>
      ${t.aka ? `<div class="aka">Also called ${esc(t.aka)}</div>` : ''}
      <p class="desc">${esc(t.desc)}</p>
      ${t.hear ? `<p class="ref"><b>Hear it</b>${esc(t.hear)}</p>` : ''}
      ${t.not ? `<p class="ref not"><b>Not</b>${esc(t.not)}</p>` : ''}
      ${t.ref ? `<p class="ref"><b>Look up</b>${esc(t.ref)}</p>` : ''}
      <div class="phrase">
        <code id="p-${t.id}">${esc(t.prompt)}</code>
        <div class="btns">
          <button type="button" class="btn add" data-add="${t.id}" aria-pressed="${picks.has(t.id)}">${picks.has(t.id) ? 'Added' : 'Add to prompt'}</button>
          <button type="button" class="btn" data-copy="${t.id}">Copy phrase</button>
        </div>
      </div>
    </div>
  </article>`;
const groupHTML = (g, sub) => `
  <section class="group" id="g-${g.id}" aria-labelledby="h-${g.id}">
    <div class="ghead">${sub ? `<div class="eyebrow">${esc(sub)}</div>` : ''}<h2 id="h-${g.id}">${esc(g.title)}</h2><p>${esc(g.intro)}</p></div>
    <div class="cards">${g.terms.map(t => cardHTML(t, g)).join('')}</div>
  </section>`;
const emptyMsg = `<p class="empty" id="empty" hidden>Nothing matches that search. Try a plainer word like "warm", "essay", "repeat" or "error".</p>`;
const chip = (id, txt) => TERMS[id] ? `<a class="chip" href="#${TERMS[id].a.id}" data-jump="${TERMS[id].t.id}"><span>${esc(txt || TERMS[id].t.name)}</span><small>${esc(TERMS[id].g.slot)}</small></a>` : esc(txt || '');
const link = id => TERMS[id] ? `<a href="#${TERMS[id].a.id}" data-jump="${TERMS[id].t.id}">${esc(TERMS[id].t.name)}</a>` : '';

function renderSame() {
  const m = WORKBOOK.same.find(x => x.id === msgId) || WORKBOOK.same[0];
  $('#msgs').innerHTML = WORKBOOK.same.map(x => `<button type="button" data-msg="${x.id}" aria-pressed="${x.id === m.id}">${esc(x.label)}</button>`).join('');
  $('#brief').innerHTML = `<b>The facts:</b> ${esc(m.brief)}`;
  $('#vgrid').innerHTML = WORKBOOK.sameVoices.map(v => `<div class="vcell"><a href="#voices" data-jump="${v}">${esc(TERMS[v].t.name)}</a><p>${esc(m.lines[v])}</p></div>`).join('');
}

function renderHome() {
  $('#home').hidden = false; $('#subject').hidden = true; $('#main').innerHTML = '';
  $('#homeCount').textContent = `${totalTerms} cards on ${WORKBOOK.areas.length} pages`;
  renderSame();
  $('#recipes').innerHTML = WORKBOOK.recipes.map(r => `<div class="rcp"><div class="eyebrow">${esc(r.label)}</div><p class="sentence">${r.parts.map(([txt, id]) => id ? chip(id, txt) : esc(txt)).join('')}</p></div>`).join('');
  $('#xtable').innerHTML = `<thead><tr><th>The job</th>${WORKBOOK.xcols.map(c => `<th>${esc(c)}</th>`).join('')}</tr></thead><tbody>` +
    WORKBOOK.xlate.map(r => `<tr><th>${esc(r.job)}<small>${esc(r.note)}</small></th>${r.cells.map(c => `<td>${c.map(x => link(x)).join(' ')}</td>`).join('')}</tr>`).join('') + '</tbody>';
  $('#tiles').innerHTML = WORKBOOK.areas.map(a => `
    <a class="tile" href="#${a.id}">
      <div class="ex" aria-hidden="true">${TERMS[a.preview] ? TERMS[a.preview].t.ex : ''}</div>
      <div class="tbody"><h3>${esc(a.title)}</h3><p>${esc(a.blurb)}</p>
      <div class="tmeta">${a.groups.reduce((n, g) => n + g.terms.length, 0)} cards · ${a.groups.map(g => esc(g.title)).join(' · ')}</div></div>
    </a>`).join('');
  $('#results').innerHTML = WORKBOOK.areas.map(a => a.groups.map(g => groupHTML(g, a.title)).join('')).join('') + emptyMsg;
  filter($('#qh'), $('#results'), true);
}

function renderSubject(a) {
  $('#home').hidden = true; $('#subject').hidden = false; $('#results').innerHTML = '';
  $('#subTitle').textContent = a.title;
  $('#subBlurb').textContent = a.blurb;
  const i = WORKBOOK.areas.indexOf(a), next = WORKBOOK.areas[(i + 1) % WORKBOOK.areas.length];
  $('#nav').innerHTML = a.groups.map(g => `<a href="#g-${g.id}" data-g="${g.id}">${esc(g.title)}<span>${g.terms.length}</span></a>`).join('');
  $('#main').innerHTML = a.groups.map(g => groupHTML(g)).join('') + emptyMsg + `<a class="next" href="#${next.id}">Next: ${esc(next.title)} →</a>`;
  $('#q').value = '';
  document.title = `${a.title} · Voice & Tone Workbook`;
}

function route() {
  const id = location.hash.slice(1);
  const a = WORKBOOK.areas.find(x => x.id === id);
  if (a) renderSubject(a);
  else if (!id || !document.getElementById(id)) { renderHome(); document.title = 'Voice & Tone Workbook'; }
  else return; // in-page anchor such as #g-everyday
  if (pendingJump) { const j = pendingJump; pendingJump = null; setTimeout(() => jumpTo(j), 60); }
  else if (a || !id) window.scrollTo(0, 0);
}

function pickedBySlot() {
  const out = [];
  WORKBOOK.areas.forEach(a => a.groups.forEach(g => {
    const ps = g.terms.filter(t => picks.has(t.id));
    if (!ps.length) return;
    const row = out.find(r => r.slot === g.slot);
    if (row) row.terms.push(...ps); else out.push({ slot: g.slot, terms: [...ps] });
  }));
  return out;
}

function compose() {
  const subj = $('#subject-in').value.trim();
  const aud = $('#aud-in').value.trim();
  const len = $('#len-in').value.trim();
  const rows = pickedBySlot();
  const n = rows.reduce((k, r) => k + r.terms.length, 0);
  const lines = [];
  if (fmt === 'guide') {
    lines.push(`# Voice guide${subj ? ` for ${subj}` : ''}`, '', 'Use this guide for everything you write for us.');
    if (aud) lines.push(`Our readers: ${aud}.`);
    const voices = rows.filter(r => r.slot === 'Voice').flatMap(r => r.terms);
    lines.push('', '## How we sound');
    if (voices.length) voices.forEach(t => lines.push(`- ${t.prompt}`)); else lines.push('- (add one or two voices from the workbook)');
    const nots = voices.filter(t => t.not);
    if (nots.length) { lines.push('', '## What we are, and what we are not'); nots.forEach(t => lines.push(`- ${t.not[0].toUpperCase() + t.not.slice(1)}.`)); }
    const tone = rows.filter(r => r.slot === 'Tone' || r.slot === 'Register').flatMap(r => r.terms);
    if (tone.length) { lines.push('', '## Tone and register', 'Voice stays the same everywhere; tone shifts with the moment. Default to:'); tone.forEach(t => lines.push(`- ${t.prompt}`)); }
    const craft = rows.filter(r => !['Voice', 'Tone', 'Register', 'Format'].includes(r.slot));
    if (craft.length) { lines.push('', '## Craft habits'); craft.forEach(r => lines.push(`- ${r.slot}: ${r.terms.map(t => t.prompt).join('; ')}`)); }
    const forms = rows.filter(r => r.slot === 'Format').flatMap(r => r.terms);
    if (forms.length) { lines.push('', '## Formats we write often'); forms.forEach(t => lines.push(`- ${t.name}: ${t.prompt}`)); }
    lines.push('', '## Always', '- Lead with what the reader needs; cut anything that doesn\'t change what they do next.', '- Vary sentence length. Prefer concrete words and exact numbers.', '- Avoid stock phrases, corporate jargon and filler intensifiers.');
    if (len) lines.push(`- Default length: ${len}.`);
  } else {
    lines.push(`Write ${subj || '[what you are writing]'}.`);
    if (aud) lines.push(`It's for ${aud}.`);
    if (len) lines.push(`Length: ${len}.`);
    lines.push('', 'How it should sound:');
    if (n) rows.forEach(r => lines.push(`- ${r.slot}: ${r.terms.map(t => t.prompt).join('; ')}`));
    else lines.push('- (add voices, tones, structures and devices from the workbook)');
    lines.push('', 'Keep the facts accurate and complete. Vary sentence length, prefer concrete detail to adjectives, and avoid stock phrases. If a style reference is named, use its techniques without imitating any real text.');
  }
  return { text: lines.join('\n'), n };
}

function renderTray() {
  const { text, n } = compose();
  $('#out').textContent = text;
  document.querySelectorAll('[data-fmt]').forEach(b => b.setAttribute('aria-pressed', b.dataset.fmt === fmt));
  $('#fmtNote').textContent = fmt === 'guide' ? 'A reusable guide to paste into a project or system prompt.' : 'A one-off ask for a single piece.';
  const names = [...picks].filter(id => TERMS[id]).map(id => TERMS[id].t.name);
  $('#count').innerHTML = n
    ? `${n} pick${n > 1 ? 's' : ''}<small>${esc(names.join(' · '))}</small>`
    : `Nothing picked yet<small>Press "Add to prompt" on any card to start</small>`;
}

function copyText(text, btn, fallbackEl) {
  const done = ok => { const o = btn.textContent; btn.textContent = ok ? 'Copied' : 'Selected, press Ctrl+C'; setTimeout(() => btn.textContent = o, 1400); };
  const select = () => { if (!fallbackEl) return; const r = document.createRange(); r.selectNodeContents(fallbackEl); const s = getSelection(); s.removeAllRanges(); s.addRange(r); };
  try {
    navigator.clipboard.writeText(text).then(() => done(true), () => { select(); done(false); });
  } catch (e) { select(); done(false); }
}

function jumpTo(id) {
  const el = document.getElementById('t-' + id);
  if (!el || el.hidden) return;
  el.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'center' });
  el.classList.add('flash'); setTimeout(() => el.classList.remove('flash'), 1400);
}

function filter(input, scope, homeMode) {
  const q = input.value.trim().toLowerCase();
  let any = false;
  scope.querySelectorAll('.group').forEach(g => {
    let vis = 0;
    g.querySelectorAll('.card').forEach(c => { const ok = !q || c.dataset.search.includes(q); c.hidden = !ok; if (ok) vis++; });
    g.hidden = !vis; if (vis) any = true;
    const nav = document.querySelector(`#nav [data-g="${g.id.slice(2)}"]`); if (nav) nav.hidden = !vis;
  });
  const empty = scope.querySelector('#empty'); if (empty) empty.hidden = any;
  if (homeMode) { $('#results').hidden = !q; ['#tiles', '#same', '#recipe', '#xlate'].forEach(s => $(s).hidden = !!q); }
}

document.addEventListener('click', e => {
  const add = e.target.closest('[data-add]');
  if (add) {
    const id = add.dataset.add;
    picks.has(id) ? picks.delete(id) : picks.add(id);
    store.set('vt-picks', [...picks]);
    const on = picks.has(id);
    add.setAttribute('aria-pressed', on); add.textContent = on ? 'Added' : 'Add to prompt';
    document.getElementById('t-' + id).classList.toggle('picked', on);
    renderTray(); return;
  }
  const cp = e.target.closest('[data-copy]');
  if (cp) { const el = document.getElementById('p-' + cp.dataset.copy); copyText(el.textContent, cp, el); return; }
  const ln = e.target.closest('[data-len]');
  if (ln) { $('#len-in').value = ln.dataset.len; store.set('vt-len', ln.dataset.len); renderTray(); return; }
  const fm = e.target.closest('[data-fmt]');
  if (fm) { fmt = fm.dataset.fmt; store.set('vt-fmt', fmt); renderTray(); return; }
  const ms = e.target.closest('[data-msg]');
  if (ms) { msgId = ms.dataset.msg; store.set('vt-msg', msgId); renderSame(); return; }
  const j = e.target.closest('[data-jump]');
  if (j) {
    e.preventDefault();
    const target = TERMS[j.dataset.jump].a.id;
    pendingJump = j.dataset.jump;
    if (location.hash.slice(1) === target) route(); else location.hash = target;
  }
});

window.addEventListener('hashchange', route);
$('#q').addEventListener('input', () => filter($('#q'), $('#main')));
$('#qh').addEventListener('input', () => filter($('#qh'), $('#results'), true));
$('#toggle').addEventListener('click', () => {
  const body = $('#trayBody'), open = body.hidden;
  body.hidden = !open; $('#toggle').setAttribute('aria-expanded', open); $('#toggle').textContent = open ? 'Hide prompt' : 'Show prompt';
});
$('#copyAll').addEventListener('click', e => copyText(compose().text, e.currentTarget, $('#out')));
$('#clear').addEventListener('click', () => {
  picks.clear(); store.set('vt-picks', []);
  document.querySelectorAll('.card.picked').forEach(c => c.classList.remove('picked'));
  document.querySelectorAll('[data-add]').forEach(b => { b.setAttribute('aria-pressed', 'false'); b.textContent = 'Add to prompt'; });
  renderTray();
});
$('#lens').innerHTML = WORKBOOK.lens.map(s => `<button type="button" data-len="${esc(s)}">${esc(s)}</button>`).join('');
[['#subject-in', 'vt-subject'], ['#aud-in', 'vt-aud'], ['#len-in', 'vt-len']].forEach(([sel, k]) => {
  $(sel).value = store.get(k, '');
  $(sel).addEventListener('input', () => { store.set(k, $(sel).value); renderTray(); });
});

route();
renderTray();
