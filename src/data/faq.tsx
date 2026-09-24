import React from "react";
import type { Lang } from "../lib/lang";

export type FaqItem = {
  id: string;
  question: string;
  answer: React.ReactNode;
};

const EMAIL = "barfingapp@gmail.com";
const EmailLink = () => (
  <a href={`mailto:${EMAIL}`} className="text-lime-ink underline hover:opacity-80">{EMAIL}</a>
);

const cs: FaqItem[] = [
  {
    id: "faq-1",
    question: "Co je BARF dieta?",
    answer: (<>BARF (Biologically Appropriate Raw Food) je krmný přístup založený na syrové stravě odpovídající přirozenému jídelníčku psa — svalovina, kosti, vnitřnosti a doplňky.</>),
  },
  {
    id: "faq-2",
    question: "Musím ručně vážit každou surovinu?",
    answer: (<>Stačí zadat, co máte v lednici a v jakém množství. Aplikace pak sama hlídá poměry a denní limity podle váhy a aktivity psa.</>),
  },
  {
    id: "faq-3",
    question: "Je aplikace zdarma?",
    answer: (<>Základní sledování krmení, lednice a makroživin je zdarma. Rozšířené funkce plánujeme přidávat postupně.</>),
  },
  {
    id: "faq-4",
    question: "Jak přidám dalšího psa do aplikace?",
    answer: (<>V hlavním menu klepni na ikonku svého psa (vlevo nahoře) a vyber <strong>Přidat psa</strong>. Zadáš jméno, věk, hmotnost a úroveň aktivity. Aplikace si automaticky spočítá správné denní dávky pro každého psa zvlášť. Mezi psy přepínáš jedním klepnutím.</>),
  },
  {
    id: "faq-5",
    question: "Jak změním hmotnost nebo údaje psa?",
    answer: (<>Jdi do <strong>Nastavení → Můj pes → Upravit profil</strong>. Po uložení se denní limity okamžitě přepočítají. Doporučujeme aktualizovat hmotnost alespoň jednou za měsíc — zejména u štěňat nebo psů na dietě — aby makra byla stále přesná.</>),
  },
  {
    id: "faq-6",
    question: "Proč mi makra nesedí? Zdají se moc vysoká nebo nízká.",
    answer: (<>Denní limit vychází z váhy psa, velikosti a aktivity — obvykle <strong>2–3 % tělesné hmotnosti za den</strong>. Pokud máš pocit, že čísla nesedí, zkontroluj nejdříve profil psa: správnou hmotnost a úroveň aktivity (klidný, střední, aktivní). Štěňata a kojící feny mají vyšší nároky — v profilu to uprav. Pokud si pořád nejsi jistý, poraď se s veterinářem nebo BARF nutričním specialistou.</>),
  },
  {
    id: "faq-7",
    question: "Jak funguje evidence lednice a hlídání čerstvosti?",
    answer: (<>Při přidání suroviny zadáš datum nákupu nebo rozmrazení. Aplikace automaticky počítá zbývající dny čerstvosti a 2 dny předem ti pošle upozornění, ať surovinu spotřebuješ. Suroviny se třídí do kategorií: <strong>Svalovina · Kosti · Vnitřnosti · Ostatní</strong>. Vidíš celkový přehled v kg a kusech na jednom místě.</>),
  },
  {
    id: "faq-8",
    question: "Jak sdílím recept nebo mix v komunitě?",
    answer: (<>V sekci <strong>Komunita</strong> klepni na tlačítko <strong>Sdílet mix</strong>. Vyber mix ze své lednice nebo ho vytvoř ručně, přidej popis a volitelně i fotku. Po zveřejnění ho ostatní mohou hodnotit a uložit jedním klepnutím rovnou do své lednice. Sdílené recepty lze filtrovat podle velikosti psa nebo alergenů.</>),
  },
  {
    id: "faq-9",
    question: "Aplikace mi neposílá upozornění. Co s tím?",
    answer: (<>Zkontroluj nejdříve oprávnění:<br /><strong>iOS:</strong> Nastavení → BarfingApp → Notifikace → povol „Povolit oznámení"<br /><strong>Android:</strong> Nastavení → Aplikace → BarfingApp → Oznámení → zapni<br />Pokud máš oprávnění zapnutá a upozornění přesto nepřicházejí, zkus aplikaci odinstalovat a znovu nainstalovat. Pokud problém trvá, napiš nám na <EmailLink />.</>),
  },
  {
    id: "faq-10",
    question: "Moje data zmizela nebo se nezobrazují správně. Co mám dělat?",
    answer: (<>Nejdříve zkontroluj připojení k internetu — data se synchronizují ze serveru při každém spuštění. Poté zkus aplikaci zavřít a znovu otevřít. Pokud problém trvá, jdi do <strong>Nastavení → Synchronizovat data</strong>. Jako poslední možnost zkus odhlásit se a přihlásit se znovu — data se stáhnou ze zálohy. Pokud ani to nepomůže, napiš nám na <EmailLink /> s popisem problému.</>),
  },
];

const en: FaqItem[] = [
  {
    id: "faq-1",
    question: "What is the BARF diet?",
    answer: (<>BARF (Biologically Appropriate Raw Food) is a feeding approach based on raw food matching a dog's natural diet — muscle meat, bones, organs and supplements.</>),
  },
  {
    id: "faq-2",
    question: "Do I have to weigh every ingredient by hand?",
    answer: (<>Just enter what you have in the fridge and how much. The app then tracks the ratios and daily limits based on your dog's weight and activity.</>),
  },
  {
    id: "faq-3",
    question: "Is the app free?",
    answer: (<>Basic feeding tracking, the fridge and macronutrients are free. We plan to add extended features gradually.</>),
  },
  {
    id: "faq-4",
    question: "How do I add another dog to the app?",
    answer: (<>In the main menu, tap your dog's icon (top left) and choose <strong>Add dog</strong>. Enter the name, age, weight and activity level. The app will automatically calculate the correct daily portions for each dog separately. Switch between dogs with a single tap.</>),
  },
  {
    id: "faq-5",
    question: "How do I update my dog's weight or details?",
    answer: (<>Go to <strong>Settings → My dog → Edit profile</strong>. After saving, the daily limits are recalculated immediately. We recommend updating the weight at least once a month — especially for puppies or dogs on a diet — to keep the macros accurate.</>),
  },
  {
    id: "faq-6",
    question: "Why don't my macros look right? They seem too high or too low.",
    answer: (<>The daily limit is based on the dog's weight, size and activity — usually <strong>2–3% of body weight per day</strong>. If the numbers don't seem right, first check your dog's profile: correct weight and activity level (calm, moderate, active). Puppies and nursing females have higher needs — update this in the profile. If you're still unsure, consult a vet or a BARF nutrition specialist.</>),
  },
  {
    id: "faq-7",
    question: "How does the fridge tracker and freshness monitoring work?",
    answer: (<>When adding an ingredient, enter the purchase or thaw date. The app automatically counts the remaining freshness days and sends you a reminder 2 days in advance so you use it in time. Ingredients are sorted into categories: <strong>Muscle · Bones · Organs · Other</strong>. You see the full overview in kg and units in one place.</>),
  },
  {
    id: "faq-8",
    question: "How do I share a recipe or mix in the community?",
    answer: (<>In the <strong>Community</strong> section, tap the <strong>Share mix</strong> button. Choose a mix from your fridge or create one manually, add a description and optionally a photo. Once published, others can rate it and save it to their own fridge with one tap. Shared recipes can be filtered by dog size or allergens.</>),
  },
  {
    id: "faq-9",
    question: "The app isn't sending me notifications. What should I do?",
    answer: (<>First check your permissions:<br /><strong>iOS:</strong> Settings → BarfingApp → Notifications → enable "Allow Notifications"<br /><strong>Android:</strong> Settings → Apps → BarfingApp → Notifications → turn on<br />If permissions are enabled and notifications still don't arrive, try uninstalling and reinstalling the app. If the problem persists, email us at <EmailLink />.</>),
  },
  {
    id: "faq-10",
    question: "My data disappeared or isn't displaying correctly. What should I do?",
    answer: (<>First check your internet connection — data syncs from the server every time the app launches. Then try closing and reopening the app. If the problem persists, go to <strong>Settings → Sync data</strong>. As a last resort, try signing out and back in — your data will be downloaded from backup. If nothing works, email us at <EmailLink /> with a description of the problem.</>),
  },
];

const de: FaqItem[] = [
  {
    id: "faq-1",
    question: "Was ist die BARF-Diät?",
    answer: (<>BARF (Biologically Appropriate Raw Food) ist ein Fütterungskonzept auf Basis roher Nahrung, die dem natürlichen Speiseplan des Hundes entspricht — Muskelfleisch, Knochen, Innereien und Zusätze.</>),
  },
  {
    id: "faq-2",
    question: "Muss ich jede Zutat von Hand abwiegen?",
    answer: (<>Es reicht, einzugeben, was im Kühlschrank liegt und wie viel. Die App überwacht dann selbst die Verhältnisse und Tageslimits nach Gewicht und Aktivität des Hundes.</>),
  },
  {
    id: "faq-3",
    question: "Ist die App kostenlos?",
    answer: (<>Die grundlegende Fütterungsübersicht, der Kühlschrank und die Makronährstoffe sind kostenlos. Erweiterte Funktionen wollen wir nach und nach ergänzen.</>),
  },
  {
    id: "faq-4",
    question: "Wie füge ich einen weiteren Hund hinzu?",
    answer: (<>Tippe im Hauptmenü auf das Symbol deines Hundes (oben links) und wähle <strong>Hund hinzufügen</strong>. Gib Name, Alter, Gewicht und Aktivitätslevel ein. Die App berechnet für jeden Hund automatisch die passenden Tagesrationen. Zwischen den Hunden wechselst du mit einem Tipp.</>),
  },
  {
    id: "faq-5",
    question: "Wie ändere ich Gewicht oder Daten meines Hundes?",
    answer: (<>Gehe zu <strong>Einstellungen → Mein Hund → Profil bearbeiten</strong>. Nach dem Speichern werden die Tageslimits sofort neu berechnet. Wir empfehlen, das Gewicht mindestens einmal im Monat zu aktualisieren — vor allem bei Welpen oder Hunden auf Diät —, damit die Makros genau bleiben.</>),
  },
  {
    id: "faq-6",
    question: "Warum stimmen meine Makros nicht? Sie wirken zu hoch oder zu niedrig.",
    answer: (<>Das Tageslimit ergibt sich aus Gewicht, Größe und Aktivität des Hundes — üblicherweise <strong>2–3 % des Körpergewichts pro Tag</strong>. Wenn die Zahlen nicht passen, prüfe zuerst das Hundeprofil: richtiges Gewicht und Aktivitätslevel (ruhig, mittel, aktiv). Welpen und säugende Hündinnen haben einen höheren Bedarf — passe das im Profil an. Bist du weiterhin unsicher, frag einen Tierarzt oder eine BARF-Ernährungsberatung.</>),
  },
  {
    id: "faq-7",
    question: "Wie funktionieren Kühlschrank und Frischeüberwachung?",
    answer: (<>Beim Hinzufügen einer Zutat gibst du das Kauf- oder Auftaudatum ein. Die App zählt automatisch die verbleibenden Frischetage und erinnert dich 2 Tage vorher, die Zutat zu verbrauchen. Zutaten sind in Kategorien sortiert: <strong>Muskelfleisch · Knochen · Innereien · Sonstiges</strong>. Du siehst die Gesamtübersicht in kg und Stück an einem Ort.</>),
  },
  {
    id: "faq-8",
    question: "Wie teile ich ein Rezept oder einen Mix in der Community?",
    answer: (<>Tippe im Bereich <strong>Community</strong> auf <strong>Mix teilen</strong>. Wähle einen Mix aus deinem Kühlschrank oder erstelle ihn von Hand, ergänze eine Beschreibung und optional ein Foto. Nach der Veröffentlichung können ihn andere bewerten und mit einem Tipp in ihren eigenen Kühlschrank speichern. Geteilte Rezepte lassen sich nach Hundegröße oder Allergenen filtern.</>),
  },
  {
    id: "faq-9",
    question: "Die App schickt mir keine Benachrichtigungen. Was tun?",
    answer: (<>Prüfe zuerst die Berechtigungen:<br /><strong>iOS:</strong> Einstellungen → BarfingApp → Mitteilungen → „Mitteilungen erlauben“ aktivieren<br /><strong>Android:</strong> Einstellungen → Apps → BarfingApp → Benachrichtigungen → einschalten<br />Wenn die Berechtigungen aktiv sind und trotzdem nichts ankommt, deinstalliere die App und installiere sie neu. Bleibt das Problem, schreib uns an <EmailLink />.</>),
  },
  {
    id: "faq-10",
    question: "Meine Daten sind verschwunden oder werden falsch angezeigt. Was soll ich tun?",
    answer: (<>Prüfe zuerst die Internetverbindung — die Daten werden bei jedem Start vom Server synchronisiert. Schließe die App dann und öffne sie erneut. Bleibt das Problem, gehe zu <strong>Einstellungen → Daten synchronisieren</strong>. Als letzte Möglichkeit melde dich ab und wieder an — die Daten werden aus dem Backup geladen. Hilft auch das nicht, schreib uns an <EmailLink /> mit einer Beschreibung des Problems.</>),
  },
];

const es: FaqItem[] = [
  {
    id: "faq-1",
    question: "¿Qué es la dieta BARF?",
    answer: (<>BARF (Biologically Appropriate Raw Food) es un enfoque de alimentación basado en comida cruda que imita la dieta natural del perro: carne muscular, huesos, vísceras y suplementos.</>),
  },
  {
    id: "faq-2",
    question: "¿Tengo que pesar cada ingrediente a mano?",
    answer: (<>Basta con indicar qué tienes en la nevera y en qué cantidad. La app controla sola las proporciones y los límites diarios según el peso y la actividad de tu perro.</>),
  },
  {
    id: "faq-3",
    question: "¿La app es gratis?",
    answer: (<>El seguimiento básico de la alimentación, la nevera y los macronutrientes son gratis. Iremos añadiendo funciones avanzadas poco a poco.</>),
  },
  {
    id: "faq-4",
    question: "¿Cómo añado otro perro a la app?",
    answer: (<>En el menú principal, toca el icono de tu perro (arriba a la izquierda) y elige <strong>Añadir perro</strong>. Introduce nombre, edad, peso y nivel de actividad. La app calcula automáticamente las raciones diarias correctas para cada perro por separado. Cambias de perro con un solo toque.</>),
  },
  {
    id: "faq-5",
    question: "¿Cómo cambio el peso o los datos de mi perro?",
    answer: (<>Ve a <strong>Ajustes → Mi perro → Editar perfil</strong>. Al guardar, los límites diarios se recalculan al instante. Recomendamos actualizar el peso al menos una vez al mes, sobre todo en cachorros o perros a dieta, para que los macros sigan siendo precisos.</>),
  },
  {
    id: "faq-6",
    question: "¿Por qué no me cuadran los macros? Parecen demasiado altos o bajos.",
    answer: (<>El límite diario se basa en el peso, el tamaño y la actividad del perro: normalmente <strong>un 2–3 % del peso corporal al día</strong>. Si los números no te cuadran, revisa primero el perfil del perro: peso correcto y nivel de actividad (tranquilo, moderado, activo). Los cachorros y las perras lactantes necesitan más; ajústalo en el perfil. Si sigues con dudas, consulta a un veterinario o a un especialista en nutrición BARF.</>),
  },
  {
    id: "faq-7",
    question: "¿Cómo funcionan la nevera y el control de frescura?",
    answer: (<>Al añadir un ingrediente, indicas la fecha de compra o de descongelación. La app calcula automáticamente los días de frescura que quedan y te avisa 2 días antes para que lo consumas. Los ingredientes se ordenan por categorías: <strong>Carne muscular · Huesos · Vísceras · Otros</strong>. Ves el resumen total en kg y unidades en un solo lugar.</>),
  },
  {
    id: "faq-8",
    question: "¿Cómo comparto una receta o un mix en la comunidad?",
    answer: (<>En la sección <strong>Comunidad</strong>, toca el botón <strong>Compartir mix</strong>. Elige un mix de tu nevera o créalo a mano, añade una descripción y, si quieres, una foto. Una vez publicado, los demás pueden valorarlo y guardarlo en su nevera con un toque. Las recetas compartidas se pueden filtrar por tamaño de perro o alérgenos.</>),
  },
  {
    id: "faq-9",
    question: "La app no me envía notificaciones. ¿Qué hago?",
    answer: (<>Revisa primero los permisos:<br /><strong>iOS:</strong> Ajustes → BarfingApp → Notificaciones → activa «Permitir notificaciones»<br /><strong>Android:</strong> Ajustes → Aplicaciones → BarfingApp → Notificaciones → actívalas<br />Si los permisos están activos y aun así no llegan, prueba a desinstalar y volver a instalar la app. Si el problema continúa, escríbenos a <EmailLink />.</>),
  },
  {
    id: "faq-10",
    question: "Mis datos han desaparecido o no se muestran bien. ¿Qué hago?",
    answer: (<>Comprueba primero la conexión a internet: los datos se sincronizan desde el servidor en cada inicio. Después cierra la app y vuelve a abrirla. Si el problema sigue, ve a <strong>Ajustes → Sincronizar datos</strong>. Como último recurso, cierra sesión y vuelve a iniciarla: los datos se descargarán de la copia de seguridad. Si ni así funciona, escríbenos a <EmailLink /> describiendo el problema.</>),
  },
];

const fr: FaqItem[] = [
  {
    id: "faq-1",
    question: "Qu'est-ce que le régime BARF ?",
    answer: (<>Le BARF (Biologically Appropriate Raw Food) est une approche alimentaire basée sur des aliments crus qui reproduisent le menu naturel du chien : viande musculaire, os, abats et compléments.</>),
  },
  {
    id: "faq-2",
    question: "Dois-je peser chaque ingrédient à la main ?",
    answer: (<>Il suffit d'indiquer ce que vous avez dans le frigo et en quelle quantité. L'appli surveille ensuite elle-même les proportions et les limites quotidiennes selon le poids et l'activité de votre chien.</>),
  },
  {
    id: "faq-3",
    question: "L'appli est-elle gratuite ?",
    answer: (<>Le suivi de base des repas, le frigo et les macronutriments sont gratuits. Nous prévoyons d'ajouter des fonctions avancées progressivement.</>),
  },
  {
    id: "faq-4",
    question: "Comment ajouter un autre chien dans l'appli ?",
    answer: (<>Dans le menu principal, touchez l'icône de votre chien (en haut à gauche) et choisissez <strong>Ajouter un chien</strong>. Renseignez le nom, l'âge, le poids et le niveau d'activité. L'appli calcule automatiquement les bonnes rations quotidiennes pour chaque chien séparément. Vous passez d'un chien à l'autre d'une seule touche.</>),
  },
  {
    id: "faq-5",
    question: "Comment modifier le poids ou les données de mon chien ?",
    answer: (<>Allez dans <strong>Réglages → Mon chien → Modifier le profil</strong>. Après l'enregistrement, les limites quotidiennes sont recalculées immédiatement. Nous recommandons de mettre le poids à jour au moins une fois par mois — surtout pour les chiots ou les chiens au régime — pour que les macros restent précis.</>),
  },
  {
    id: "faq-6",
    question: "Pourquoi mes macros semblent faux ? Ils paraissent trop hauts ou trop bas.",
    answer: (<>La limite quotidienne dépend du poids, de la taille et de l'activité du chien — généralement <strong>2 à 3 % du poids corporel par jour</strong>. Si les chiffres ne collent pas, vérifiez d'abord le profil du chien : bon poids et niveau d'activité (calme, modéré, actif). Les chiots et les chiennes allaitantes ont des besoins plus élevés — ajustez-le dans le profil. En cas de doute, demandez conseil à un vétérinaire ou à un spécialiste en nutrition BARF.</>),
  },
  {
    id: "faq-7",
    question: "Comment fonctionnent le frigo et le suivi de fraîcheur ?",
    answer: (<>Quand vous ajoutez un ingrédient, vous indiquez la date d'achat ou de décongélation. L'appli compte automatiquement les jours de fraîcheur restants et vous prévient 2 jours à l'avance pour que vous le consommiez à temps. Les ingrédients sont classés par catégories : <strong>Viande musculaire · Os · Abats · Autres</strong>. Vous voyez le total en kg et en pièces au même endroit.</>),
  },
  {
    id: "faq-8",
    question: "Comment partager une recette ou un mix dans la communauté ?",
    answer: (<>Dans la section <strong>Communauté</strong>, touchez le bouton <strong>Partager un mix</strong>. Choisissez un mix de votre frigo ou créez-le à la main, ajoutez une description et éventuellement une photo. Une fois publié, les autres peuvent le noter et l'enregistrer d'une touche dans leur propre frigo. Les recettes partagées se filtrent par taille de chien ou par allergènes.</>),
  },
  {
    id: "faq-9",
    question: "L'appli ne m'envoie pas de notifications. Que faire ?",
    answer: (<>Vérifiez d'abord les autorisations :<br /><strong>iOS :</strong> Réglages → BarfingApp → Notifications → activez « Autoriser les notifications »<br /><strong>Android :</strong> Paramètres → Applications → BarfingApp → Notifications → activez<br />Si les autorisations sont actives et que rien n'arrive, essayez de désinstaller puis réinstaller l'appli. Si le problème persiste, écrivez-nous à <EmailLink />.</>),
  },
  {
    id: "faq-10",
    question: "Mes données ont disparu ou s'affichent mal. Que faire ?",
    answer: (<>Vérifiez d'abord la connexion internet — les données se synchronisent depuis le serveur à chaque lancement. Fermez ensuite l'appli et rouvrez-la. Si le problème persiste, allez dans <strong>Réglages → Synchroniser les données</strong>. En dernier recours, déconnectez-vous puis reconnectez-vous — les données seront rechargées depuis la sauvegarde. Si rien n'y fait, écrivez-nous à <EmailLink /> en décrivant le problème.</>),
  },
];

const it: FaqItem[] = [
  {
    id: "faq-1",
    question: "Che cos'è la dieta BARF?",
    answer: (<>BARF (Biologically Appropriate Raw Food) è un approccio alimentare basato su cibo crudo che riproduce la dieta naturale del cane: carne muscolare, ossa, frattaglie e integratori.</>),
  },
  {
    id: "faq-2",
    question: "Devo pesare ogni ingrediente a mano?",
    answer: (<>Basta inserire cosa hai in frigo e in che quantità. L'app controlla da sola le proporzioni e i limiti giornalieri in base a peso e attività del cane.</>),
  },
  {
    id: "faq-3",
    question: "L'app è gratuita?",
    answer: (<>Il monitoraggio base dei pasti, il frigo e i macronutrienti sono gratuiti. Le funzioni avanzate le aggiungeremo un po' alla volta.</>),
  },
  {
    id: "faq-4",
    question: "Come aggiungo un altro cane all'app?",
    answer: (<>Nel menu principale tocca l'icona del tuo cane (in alto a sinistra) e scegli <strong>Aggiungi cane</strong>. Inserisci nome, età, peso e livello di attività. L'app calcola automaticamente le razioni giornaliere corrette per ogni cane separatamente. Passi da un cane all'altro con un tocco.</>),
  },
  {
    id: "faq-5",
    question: "Come modifico il peso o i dati del cane?",
    answer: (<>Vai in <strong>Impostazioni → Il mio cane → Modifica profilo</strong>. Dopo il salvataggio i limiti giornalieri vengono ricalcolati subito. Consigliamo di aggiornare il peso almeno una volta al mese — soprattutto per cuccioli o cani a dieta — così i macro restano precisi.</>),
  },
  {
    id: "faq-6",
    question: "Perché i macro non tornano? Sembrano troppo alti o troppo bassi.",
    answer: (<>Il limite giornaliero dipende da peso, taglia e attività del cane — di solito <strong>il 2–3 % del peso corporeo al giorno</strong>. Se i numeri non tornano, controlla prima il profilo del cane: peso corretto e livello di attività (tranquillo, medio, attivo). Cuccioli e cagne in allattamento hanno bisogni maggiori — impostalo nel profilo. Se hai ancora dubbi, chiedi a un veterinario o a un nutrizionista BARF.</>),
  },
  {
    id: "faq-7",
    question: "Come funzionano il frigo e il controllo della freschezza?",
    answer: (<>Quando aggiungi un ingrediente inserisci la data di acquisto o di scongelamento. L'app calcola automaticamente i giorni di freschezza rimasti e ti avvisa 2 giorni prima, così lo consumi in tempo. Gli ingredienti sono divisi in categorie: <strong>Carne muscolare · Ossa · Frattaglie · Altro</strong>. Vedi il totale in kg e pezzi in un unico posto.</>),
  },
  {
    id: "faq-8",
    question: "Come condivido una ricetta o un mix nella community?",
    answer: (<>Nella sezione <strong>Community</strong> tocca il pulsante <strong>Condividi mix</strong>. Scegli un mix dal tuo frigo o crealo a mano, aggiungi una descrizione e se vuoi una foto. Una volta pubblicato, gli altri possono valutarlo e salvarlo nel proprio frigo con un tocco. Le ricette condivise si filtrano per taglia del cane o allergeni.</>),
  },
  {
    id: "faq-9",
    question: "L'app non mi manda notifiche. Cosa faccio?",
    answer: (<>Controlla prima i permessi:<br /><strong>iOS:</strong> Impostazioni → BarfingApp → Notifiche → attiva «Consenti notifiche»<br /><strong>Android:</strong> Impostazioni → App → BarfingApp → Notifiche → attiva<br />Se i permessi sono attivi e le notifiche comunque non arrivano, prova a disinstallare e reinstallare l'app. Se il problema persiste, scrivici a <EmailLink />.</>),
  },
  {
    id: "faq-10",
    question: "I miei dati sono spariti o non si vedono correttamente. Cosa faccio?",
    answer: (<>Controlla prima la connessione a internet — i dati si sincronizzano dal server a ogni avvio. Poi chiudi l'app e riaprila. Se il problema persiste, vai in <strong>Impostazioni → Sincronizza dati</strong>. Come ultima risorsa esci e accedi di nuovo — i dati verranno scaricati dal backup. Se nemmeno questo aiuta, scrivici a <EmailLink /> descrivendo il problema.</>),
  },
];

const pl: FaqItem[] = [
  {
    id: "faq-1",
    question: "Czym jest dieta BARF?",
    answer: (<>BARF (Biologically Appropriate Raw Food) to sposób żywienia oparty na surowym pokarmie odpowiadającym naturalnej diecie psa — mięso mięśniowe, kości, podroby i dodatki.</>),
  },
  {
    id: "faq-2",
    question: "Czy muszę ręcznie ważyć każdy składnik?",
    answer: (<>Wystarczy wpisać, co masz w lodówce i w jakiej ilości. Aplikacja sama pilnuje proporcji i dziennych limitów według wagi i aktywności psa.</>),
  },
  {
    id: "faq-3",
    question: "Czy aplikacja jest darmowa?",
    answer: (<>Podstawowe śledzenie karmienia, lodówka i makroskładniki są za darmo. Rozszerzone funkcje planujemy dodawać stopniowo.</>),
  },
  {
    id: "faq-4",
    question: "Jak dodać kolejnego psa do aplikacji?",
    answer: (<>W menu głównym stuknij ikonę swojego psa (u góry po lewej) i wybierz <strong>Dodaj psa</strong>. Podaj imię, wiek, wagę i poziom aktywności. Aplikacja automatycznie policzy właściwe dzienne porcje dla każdego psa osobno. Między psami przełączasz się jednym stuknięciem.</>),
  },
  {
    id: "faq-5",
    question: "Jak zmienić wagę lub dane psa?",
    answer: (<>Wejdź w <strong>Ustawienia → Mój pies → Edytuj profil</strong>. Po zapisaniu dzienne limity od razu się przeliczą. Zalecamy aktualizować wagę co najmniej raz w miesiącu — zwłaszcza u szczeniąt i psów na diecie — żeby makro były wciąż dokładne.</>),
  },
  {
    id: "faq-6",
    question: "Dlaczego makro mi się nie zgadzają? Wydają się za wysokie albo za niskie.",
    answer: (<>Dzienny limit wynika z wagi, wielkości i aktywności psa — zwykle <strong>2–3 % masy ciała dziennie</strong>. Jeśli liczby nie pasują, sprawdź najpierw profil psa: właściwą wagę i poziom aktywności (spokojny, umiarkowany, aktywny). Szczenięta i suki karmiące mają większe potrzeby — ustaw to w profilu. Jeśli nadal masz wątpliwości, skonsultuj się z weterynarzem lub specjalistą od żywienia BARF.</>),
  },
  {
    id: "faq-7",
    question: "Jak działa lodówka i pilnowanie świeżości?",
    answer: (<>Dodając składnik, podajesz datę zakupu lub rozmrożenia. Aplikacja automatycznie liczy pozostałe dni świeżości i 2 dni wcześniej wyśle ci przypomnienie, żeby go zużyć. Składniki dzielą się na kategorie: <strong>Mięso mięśniowe · Kości · Podroby · Inne</strong>. Cały przegląd w kg i sztukach widzisz w jednym miejscu.</>),
  },
  {
    id: "faq-8",
    question: "Jak udostępnić przepis lub mix w społeczności?",
    answer: (<>W sekcji <strong>Społeczność</strong> stuknij przycisk <strong>Udostępnij mix</strong>. Wybierz mix ze swojej lodówki albo stwórz go ręcznie, dodaj opis i opcjonalnie zdjęcie. Po opublikowaniu inni mogą go oceniać i jednym stuknięciem zapisać prosto do swojej lodówki. Udostępnione przepisy można filtrować według wielkości psa lub alergenów.</>),
  },
  {
    id: "faq-9",
    question: "Aplikacja nie wysyła mi powiadomień. Co robić?",
    answer: (<>Najpierw sprawdź uprawnienia:<br /><strong>iOS:</strong> Ustawienia → BarfingApp → Powiadomienia → włącz „Zezwalaj na powiadomienia”<br /><strong>Android:</strong> Ustawienia → Aplikacje → BarfingApp → Powiadomienia → włącz<br />Jeśli uprawnienia są włączone, a powiadomienia mimo to nie przychodzą, spróbuj odinstalować i ponownie zainstalować aplikację. Jeśli problem nie ustąpi, napisz do nas na <EmailLink />.</>),
  },
  {
    id: "faq-10",
    question: "Moje dane zniknęły albo wyświetlają się źle. Co mam zrobić?",
    answer: (<>Najpierw sprawdź połączenie z internetem — dane synchronizują się z serwera przy każdym uruchomieniu. Potem zamknij aplikację i otwórz ją ponownie. Jeśli problem trwa, wejdź w <strong>Ustawienia → Synchronizuj dane</strong>. W ostateczności wyloguj się i zaloguj ponownie — dane pobiorą się z kopii zapasowej. Jeśli i to nie pomoże, napisz do nas na <EmailLink /> z opisem problemu.</>),
  },
];

export const faqItems: Record<Lang, FaqItem[]> = { cs, en, de, es, fr, it, pl };
