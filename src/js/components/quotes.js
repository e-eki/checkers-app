
import React, { Component } from 'react';

export default class Quotes extends Component {

	constructor(props) {
		super(props);

		var quotesFile = JSON.stringify([
			{"quote": "Искреннее сердце — это драгоценность, которую никогда никуда не спрячешь.", "author": "Ходзе Сигэтоки (1198–1261) — монах, писатель"},
			{"quote": "Глубоко постигни этот мир снов, который проходит в мгновение ока.", "author": "Ходзе Сигэтоки (1198–1261) — монах, писатель"},
			{"quote": "Если ты раздумываешь, делать это или не делать, то, как правило, бывает лучше этого не делать.", "author": "Кэнко Хоси (Урабэ Канэеси) (1283–1350) — писатель"},
			{"quote": "В высшей степени достойно сожаления, если самурай упускает момент, когда ему следует умереть.", "author": "Сиба Есимаса (1350–1419) — выдающийся администратор, полководец, поэт"},
			{"quote": "Людей с острым умом следует искать среди тех, кто склонен думать.", "author": "Сиба Есимаса (1350–1419) — выдающийся администратор, полководец, поэт"},
			{"quote": "Самурай должен умиротворять свое сердце и смотреть вглубь других. Вот высшее из всех боевых искусств.", "author": "Сиба Есимаса (1350–1419) — выдающийся администратор, полководец, поэт"},
			{"quote": "Даже если у человека нет особых талантов, но он упорно овладевает знанием, он не опозорится перед другими.", "author": "Сиба Есимаса (1350–1419) — выдающийся администратор, полководец, поэт"},
			{"quote": "Каждого человека следует использовать в соответствии с его способностями.", "author": "Сиба Есимаса (1350–1419) — выдающийся администратор, полководец, поэт"},
			{"quote": "Природа человека устроена так, что учиться добру очень тяжело, а склоняться ко злу — легко, поэтому каждый постепенно становится похожим на тех, с кем он знаком.", "author": "Сиба Есимаса (1350–1419) — выдающийся администратор, полководец, поэт"},
			{"quote": "Нет ничего более постыдного для человека, чем выходить из себя.", "author": "Сиба Есимаса (1350–1419) — выдающийся администратор, полководец, поэт"},
			{"quote": "Несомненное достоинство — не стыдиться исправлять собственные ошибки. Первый же недостаток — вбить что-нибудь себе в голову, хорошее или плохое, и упрямо стоять на своем.", "author": "Сиба Есимаса (1350–1419) — выдающийся администратор, полководец, поэт"},
			{"quote": "Даже если в ходе сражения ты видишь, что не сможешь победить, укрепи свое сердце и будь уверен, что никто не сможет превзойти тебя в стойкости.", "author": "Сиба Есимаса (1350–1419) — выдающийся администратор, полководец, поэт"},
			{"quote": "В этом изменчивом мире следует идти по пути самодисциплины.", "author": "Сиба Есимаса (1350–1419) — выдающийся администратор, полководец, поэт"},
			{"quote": "По-настоящему прозорливый человек всегда увидит и начало, и конец, и не станет пренебрегать даже мельчайшими деталями.", "author": "Такэда Сингэн (1521–1573) — великий полководец"},
			{"quote": "Если люди дальновидны, находчивы и умеют оценить ситуацию, то какие бы трудности не стали перед ними, их слава будет жить в последующих поколениях.", "author": "Такэда Сингэн (1521–1573) — великий полководец"},
			{"quote": "Учение для человека — все равно что ветви и листья для дерева. Без него он просто не сможет жить.", "author": "Такэда Сингэн (1521–1573) — великий полководец"},
			{"quote": "Пусть твои воины не поносят врага. Древняя пословица гласит: «Разбуди пчелу, и она набросится на тебя с яростью дракона».", "author": "Такэда Нобусигэ (1525–1561) — воин"},
			{"quote": "Никогда и ни при каких обстоятельствах не лги.", "author": "Такэда Нобусигэ (1525–1561) — воин"},
			{"quote": "Не пренебрегай упреками в свою сторону.", "author": "Такэда Нобусигэ (1525–1561) — воин"},
			{"quote": "Не сражайся за все подряд.", "author": "Такэда Нобусигэ (1525–1561) — воин"},
			{"quote": "Никогда не показывай собственной слабости, даже в присутствии любящих тебя родственников и вассалов.", "author": "Такэда Нобусигэ (1525–1561) — воин"},
			{"quote": "Не теряй себя из-за одной ошибки. Главное — не утратить впоследствии присутствия духа.", "author": "Такэда Нобусигэ (1525–1561) — воин"},
			{"quote": "Даже если ты с кем-нибудь очень близок, хорошо подумай, прежде чем обратиться к нему с просьбой.", "author": "Такэда Нобусигэ (1525–1561) — воин"},
			{"quote": "Знатен человек или низок по происхождению, но если он хотя бы раз не поставил на карту свою жизнь, у него есть повод устыдиться.", "author": "Набэсима Наосигэ (1538–1618) — самурай"},
			{"quote": "Ум — это цветок проницательности. Но есть много примеров, когда цветы цветут, но не плодоносят.", "author": "Набэсима Наосигэ (1538–1618) — самурай"},
			{"quote": "Во всех делах в первую очередь думай о человеке.", "author": "Набэсима Наосигэ (1538–1618) — самурай"},
			{"quote": "Во всем надлежит действовать терпеливо.", "author": "Набэсима Наосигэ (1538–1618) — самурай"},
			{"quote": "Если дела делаются с неохотой, семь из десяти окончатся неудачей.", "author": "Набэсима Наосигэ (1538–1618) — самурай"},
			{"quote": "В сражении следует быть жестоким и безрассудным. Но забудь об этом в повседневной жизни.", "author": "Набэсима Наосигэ (1538–1618) — самурай"},
			{"quote": "Если будешь отдавать свое сердце утонченному и изящному, то уподобишься женщине. Рожденный в доме самурая должен думать только о том, как взять короткий и длинный мечи и умереть.", "author": "Като Киемаса (1562–1611) — выдающийся полководец"},
			{"quote": "Самурай, увлекающийся танцами, кои не входят в число боевых искусств, должен быть приговорен к сэппуку.", "author": "Като Киемаса (1562–1611) — выдающийся полководец"},
			{"quote": "Самурай должен иметь доспехи, соответствующие его положению, платить своим слугам, а остальные деньги использовать для военных нужд.", "author": "Като Киемаса (1562–1611) — выдающийся полководец"},
			{"quote": "Когда кто-то обнажает меч, он мысленно убивает человека.", "author": "Като Киемаса (1562–1611) — выдающийся полководец"},
			{"quote": "Каждый изучает то, к чему имеет естественную склонность.", "author": "Миямото Мусаси (1584–1645) — легендарный самурай"},
			{"quote": "Путь Воина есть решительное, окончательное и абсолютное принятие смерти.", "author": "Миямото Мусаси (1584–1645) — легендарный самурай"},
			{"quote": "Смерть — самое важное обстоятельство в жизни Воина. Если ты живешь, свыкнувшись с мыслью о возможной гибели и решившись на нее, если думаешь о себе как о мертвом, слившись с идеей Пути Воина, то будь уверен, что сумеешь пройти по жизни так, что любая неудача станет невозможной, и ты исполнишь свои обязанности как должно…", "author": "Миямото Мусаси (1584–1645) — легендарный самурай"},
			{"quote": "В бою состояние твоего духа не должно отличаться от повседневного. И в схватке, и в обыденной жизни ты должен быть целеустремлен, но спокоен.", "author": "Миямото Мусаси (1584–1645) — легендарный самурай"},
			{"quote": "Если каждое утро и каждый вечер ты будешь готовить себя к смерти и сможешь жить так, словно твое тело уже умерло, ты станешь подлинным самураем. Тогда вся твоя жизнь будет безупречной, и ты преуспеешь на своем поприще.", "author": "Ямамото Цунэтомо (1659–1719) — самурай, автор трактата о самурайской этике «Сокрытое в листве»"},
			{"quote": "Если ты появился на свет в старинном самурайском роду, достаточно лишь глубоко задуматься над верностью предкам, презреть тело и разум и всецело посвятить себя служению хозяину. Можно считать удачей, если ты, к тому же, наделен мудростью и талантами, и умеешь правильно воспользоваться ими.", "author": "Ямамото Цунэтомо (1659–1719) — самурай, автор трактата о самурайской этике «Сокрытое в листве»"},
			{"quote": "Люди полагают, что, размышляя над сложными делами, они могут разобраться с ними. Однако, когда они задумываются над чем-нибудь, у них появляются ложные мысли. Они не могут принять правильное решение, потому что в своих рассуждениях руководствуются стремлением к личной выгоде.", "author": "Ямамото Цунэтомо (1659–1719) — самурай, автор трактата о самурайской этике «Сокрытое в листве»"},
			{"quote": "Всю свою жизнь прилежно учись. Каждый день становись более искусным, чем ты был за день до этого, а на следующий день — более искусным, чем сегодня. Совершенствование не имеет конца.", "author": "Ямамото Цунэтомо (1659–1719) — самурай, автор трактата о самурайской этике «Сокрытое в листве»"},
			{"quote": "Правильно поступает тот, кто относится к миру, словно к сновидению. Когда тебе снится кошмар, ты просыпаешься и говоришь себе, что это был всего лишь сон.", "author": "Ямамото Цунэтомо (1659–1719) — самурай, автор трактата о самурайской этике «Сокрытое в листве»"},
			{"quote": "Тот, кто знает очень мало, будет напускать на себя вид знатока. Это говорит о его неопытности. Если человек что-то хорошо знает, об этом по нему не скажешь. Такой человек ведет себя благопристойно.", "author": "Ямамото Цунэтомо (1659–1719) — самурай, автор трактата о самурайской этике «Сокрытое в листве»"},
			{"quote": "Очень расчетливый ум не достоин уважения. Рассчитывать — это значит взвешивать и помнить, что можно потерять и что нужно выиграть. Расчетливый ум никогда не сможет подняться над мыслью о корысти и убытках. А что есть смерть, как не убыток? Что есть жизнь, как не корысть? Кто рассчитывает, тот корыстен. Поскольку такой человек в любых обстоятельствах работает только с корыстной целью, — он должен опасаться смерти. Значит, такой человек — трус.", "author": "Ямамото Цунэтомо (1659–1719) — самурай, автор трактата о самурайской этике «Сокрытое в листве»"},
			{"quote": "Я постиг, что Путь Самурая — это смерть. В ситуации «или — или» без колебаний выбирай смерть. Это нетрудно. Исполнись решимости и действуй.", "author": "Ямамото Цунэтомо (1659–1719) — самурай, автор трактата о самурайской этике «Сокрытое в листве»"},
			{"quote": "Самурай должен всегда помнить — помнить днем и ночью, с того дня, когда он берет в руки палочки, находясь в предвкушении новогодней трапезы, до последней ночи уходящего года, когда он платит оставшиеся долги, — помнить о том, что он должен умереть.", "author": "Ямамото Цунэтомо (1659–1719) — самурай, автор трактата о самурайской этике «Сокрытое в листве»"},
			{"quote": "Чтобы подняться более высоко, упражняйся всегда, что бы не случилось с тобой.", "author": "Ямамото Цунэтомо (1659–1719) — самурай, автор трактата о самурайской этике «Сокрытое в листве»"},
			{"quote": "Жизнь — это мгновение за мгновением, и мера вашей жизни — то, как ваш дух расцветает в каждое из этих мгновений.", "author": "Морихэй Уэсиба (1883–1969) — основатель современного айкидо"},
			{"quote": "Смысл победы в отсутствии конфликта. Смысл отсутствия конфликта в отсутствии отделенности.", "author": "Морихэй Уэсиба (1883–1969) — основатель современного айкидо"},
			{"quote": "Никогда не знать поражения означает никогда не вступать в борьбу.", "author": "Морихэй Уэсиба (1883–1969) — основатель современного айкидо"},
			{"quote": "Подобно тому, как Природа любит и защищает все свои создания и помогает всему сущему расти и развиваться, так и айкидо ведет каждого, кто посвящает себя ему, по пути познания своих истин, предоставляя эту возможность со всей своей искренностью.", "author": "Морихэй Уэсиба (1883–1969) — основатель современного айкидо"},
			{"quote": "Айкидо — это лекарство для больного мира. В мире есть зло и беспорядок, потому что люди забыли о том, что все вещи происходят из одного источника. Возвратись к этому источнику и оставь все эгоистические мысли, пустячные желания и гнев.", "author": "Морихэй Уэсиба (1883–1969) — основатель современного айкидо"},
			{"quote": "Двигайся, как луч света, летай, как молния, бей, как гром, вращайся вокруг устойчивого центра.", "author": "Морихэй Уэсиба (1883–1969) — основатель современного айкидо"},
			{"quote": "Техники требуют четырех качеств, в которых отражается природа нашего мира. В зависимости от обстоятельств, ты должен быть: твердым, как алмаз, гибким, как ива, плавным, как течение воды, или пустым, как небо.", "author": "Морихэй Уэсиба (1883–1969) — основатель современного айкидо"},
			{"quote": "Когда противник идет вперед, выходи навстречу и приветствуй его. Если он хочет отойти, проводи его.", "author": "Морихэй Уэсиба (1883–1969) — основатель современного айкидо"},
			{"quote": "Положитесь на величие того, кто правит этим миром и смело идите вперед.", "author": "Морихэй Уэсиба (1883–1969) — основатель современного айкидо"},
			{"quote": "Всегда старайся быть в союзе с небом и землей; тогда будешь видеть мир в истинном свете. Самодовольство исчезнет, и ты сможешь поглощать в себя любое нападение.", "author": "Морихэй Уэсиба (1883–1969) — основатель современного айкидо"},
			{"quote": "Созерцай устройство этого мира, слушай слова мудрых и принимай все хорошее и доброе как свое. Опираясь на это, открой свою собственную дверь к истине. Не прогляди истину, которая прямо перед тобой. Все вокруг… должно стать твоим учителем.", "author": "Морихэй Уэсиба (1883–1969) — основатель современного айкидо"},
			{"quote": "Кем не владеет ничто, тот владеет всем.", "author": "Морихэй Уэсиба (1883–1969) — основатель современного айкидо"},
			{"quote": "Все законы неба и земли живут в тебе.", "author": "Морихэй Уэсиба (1883–1969) — основатель современного айкидо"},
			{"quote": "Правильная поза тела отражает правильное состояние ума.", "author": "Морихэй Уэсиба (1883–1969) — основатель современного айкидо"},
			{"quote": "Не веди бесполезные разговоры, познавай посредством практики.", "author": "Морихэй Уэсиба (1883–1969) — основатель современного айкидо"},
			{"quote": "Если ты испытываешь других, соревнуешься с ними, критикуешь их — это приводит к твоему ослаблению и поражению.", "author": "Морихэй Уэсиба (1883–1969) — основатель современного айкидо"},
			{"quote": "В железной руде много шлаков, ослабляющих ее свойства; плавкой, ковкой и закалкой железо превращают в сталь, и затем придают ей форму острого, как бритва, меча. Человеческие существа развиваются в той же последовательности.", "author": "Морихэй Уэсиба (1883–1969) — основатель современного айкидо"},
			{"quote": "Необходимо разработать стратегию, которая использовала бы все доступные физические условия и элементы. Лучшая стратегия — это та, которая полагается на неограниченный диапазон реакций.", "author": "Морихэй Уэсиба (1883–1969) — основатель современного айкидо"},
			{"quote": "Если твое сердце велико, чтобы принять противников, ты можешь видеть их насквозь и избегать нападений. И тогда ты сможешь направлять их по пути, указанному тебе небом и землей.", "author": "Морихэй Уэсиба (1883–1969) — основатель современного айкидо"},
			{"quote": "Свободный от слабости, не обращай внимания на яростные атаки своих врагов: иди и действуй!", "author": "Морихэй Уэсиба (1883–1969) — основатель современного айкидо"},
			{"quote": "Не взирай на этот мир со страхом и отвращением. Смело смотри в лицо тому, что предлагают тебе боги.", "author": "Морихэй Уэсиба (1883–1969) — основатель современного айкидо"},
			{"quote": "Выйди за пределы жизни и смерти, и тогда сможешь пройти через все кризисы спокойно и безопасно.", "author": "Морихэй Уэсиба (1883–1969) — основатель современного айкидо"},
			{"quote": "Неудача — залог успеха; каждая ошибка чему-то учит нас.", "author": "Морихэй Уэсиба (1883–1969) — основатель современного айкидо"},
			{"quote": "В нашей технике мы полностью входим в атаку противника, совершенно растворяемся в ней и решительно ею управляем.", "author": "Морихэй Уэсиба (1883–1969) — основатель современного айкидо"},
			{"quote": "Видя меня перед собой, враг нападает, но к этому времени я уже стою за его спиной.", "author": "Морихэй Уэсиба (1883–1969) — основатель современного айкидо"},
			{"quote": "Твой дух есть твой истинный щит.", "author": "Морихэй Уэсиба (1883–1969) — основатель современного айкидо"},
			{"quote": "Побеждай своих противников духовно, заставив их осознать бессмысленность их действий. Путь Воина заключается в том, чтобы устанавливать гармонию.", "author": "Морихэй Уэсиба (1883–1969) — основатель современного айкидо"},
			{"quote": "В конце концов, ты должен будешь вообще забыть о технике. Чем дальше продвигаешься, тем меньше остается догм. Великий Путь — это, на самом деле, Отсутствие Пути.", "author": "Морихэй Уэсиба (1883–1969) — основатель современного айкидо"},
			{"quote": "Азарт в игре сильнее страсти в любви.", "author": "японская пословица"},
			{"quote": "Алмазу нужна шлифовка, человеку — образование.", "author": "японская пословица"},
			{"quote": "Без предмета нет и тени.", "author": "японская пословица"},
			{"quote": "Без хорошего хода в шахматы не выиграешь.", "author": "японская пословица"},
			{"quote": "В долине вся вода в один ручей стекается.", "author": "японская пословица"},
			{"quote": "Выигрываешь — хочется выиграть еще; проигрываешь — хочется отыграться.", "author": "японская пословица"},
			{"quote": "Если хочешь убить полководца, убей сначала его коня.", "author": "японская пословица"},
			{"quote": "Есть терпение — будет и умение.", "author": "японская пословица"},
			{"quote": "Завтра будет дуть завтрашний ветер.", "author": "японская пословица"},
			{"quote": "Зеркало разума тоже тускнеет.", "author": "японская пословица"},
			{"quote": "Лунная ночь и вареный рис всегда бывают кстати.", "author": "японская пословица"},
		]);
		
		this.quotes = JSON.parse(quotesFile);
	}

    render() {

        return this.quotes;
    }
}