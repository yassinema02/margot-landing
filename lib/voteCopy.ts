export type VoteLocale = 'fr' | 'en' | 'es';
export const VOTE_COPY = {
 fr: {
  report:"Signaler", reportTitle:"Signaler ce contenu", reportNotice:"Choisis un motif. Ton signalement reste confidentiel et sera examiné sous 24 h.", reportSend:"Envoyer le signalement", reportSending:"Envoi du signalement…", reportSent:"Ton signalement a été reçu. Merci.", reportFailed:"L’envoi a échoué. Réessaie avec le même motif.", reportLimited:"Tu as envoyé trop de signalements. Réessaie plus tard.", reportUnavailable:"Ce contenu n’est plus disponible pour le signalement.", reportCancel:"Annuler", report_harassment:"Harcèlement", report_hate:"Haine ou discrimination", report_sexual:"Contenu sexuel", report_violence:"Violence ou menace", report_spam:"Spam ou arnaque", report_privacy:"Atteinte à la vie privée", report_other:"Autre motif",
  social_text_rejected:"Ce texte contient un terme non autorisé. Modifie-le pour continuer",
  title:'Aide à choisir une tenue', question:'Quelle tenue tu préfères pour', voteA:'Je vote A', voteB:'Je vote B',
  firstName:'Ton prénom (facultatif)', reason:'Pourquoi ce choix (facultatif)', privateNote:'Seule la personne qui a créé ce vote verra ton prénom et ta réponse.',
  submitting:'Envoi de ton vote…', voted:'Ton choix est enregistré :', change:'Tu peux encore changer ton choix.', closed:'Le vote est terminé',
  unavailable:'Ce lien n’est plus disponible', temporary:'Le vote est temporairement indisponible', limited:'Trop de tentatives. Réessaie dans', seconds:'secondes.', retry:'Réessayer',
  cookie:'Autorise les cookies de ce site pour enregistrer un seul vote par appareil, puis réessaie.', invalid:'Vérifie ton prénom (40 caractères) et ta réponse (160 caractères).',
  pitch:'Margot choisit ta tenue chaque matin. Avec les vêtements que tu as déjà', download:'Découvrir Margot', appStore:'App Store', playStore:'Google Play', copy:'Copier le lien', copied:'Lien copié', copyFailed:'La copie a échoué. Tu peux sélectionner ce lien pour le copier.', piece:'Vêtement',
 },
 en: {
  report:"Report", reportTitle:"Report this content", reportNotice:"Choose a reason. Your report stays confidential and will be reviewed within 24 hours.", reportSend:"Send report", reportSending:"Sending report…", reportSent:"Your report has been received. Thank you.", reportFailed:"Sending failed. Try again with the same reason.", reportLimited:"You have sent too many reports. Try again later.", reportUnavailable:"This content is no longer available to report.", reportCancel:"Cancel", report_harassment:"Harassment", report_hate:"Hate or discrimination", report_sexual:"Sexual content", report_violence:"Violence or threat", report_spam:"Spam or scam", report_privacy:"Privacy violation", report_other:"Other reason",
  social_text_rejected:"This text contains a term that is not allowed. Edit it to continue",
  title:'Help choose an outfit', question:'Which outfit do you prefer for', voteA:'I vote A', voteB:'I vote B',
  firstName:'Your first name (optional)', reason:'Why this choice (optional)', privateNote:'Only the person who created this vote will see your first name and reply.',
  submitting:'Sending your vote…', voted:'Your choice is saved:', change:'You can still change your choice.', closed:'Voting has ended',
  unavailable:'This link is no longer available', temporary:'Voting is temporarily unavailable', limited:'Too many attempts. Try again in', seconds:'seconds.', retry:'Try again',
  cookie:'Allow cookies for this site to save one vote per device, then try again.', invalid:'Check your first name (40 characters) and reply (160 characters).',
  pitch:'Margot chooses your outfit every morning. With the clothes you already own', download:'Discover Margot', appStore:'App Store', playStore:'Google Play', copy:'Copy the link', copied:'Link copied', copyFailed:'Copying failed. You can select this link to copy it.', piece:'Garment',
 },
 es: {
  report:"Denunciar", reportTitle:"Denunciar este contenido", reportNotice:"Elige un motivo. Tu denuncia es confidencial y se revisará en un plazo de 24 horas.", reportSend:"Enviar denuncia", reportSending:"Enviando denuncia…", reportSent:"Tu denuncia se ha recibido. Gracias.", reportFailed:"No se ha podido enviar. Inténtalo con el mismo motivo.", reportLimited:"Has enviado demasiadas denuncias. Inténtalo más tarde.", reportUnavailable:"Este contenido ya no está disponible para denunciar.", reportCancel:"Cancelar", report_harassment:"Acoso", report_hate:"Odio o discriminación", report_sexual:"Contenido sexual", report_violence:"Violencia o amenaza", report_spam:"Spam o estafa", report_privacy:"Violación de la privacidad", report_other:"Otro motivo",
  social_text_rejected:"Este texto contiene un término no permitido. Cámbialo para continuar",
  title:'Ayuda a elegir un conjunto', question:'Qué conjunto prefieres para', voteA:'Voto A', voteB:'Voto B',
  firstName:'Tu nombre (opcional)', reason:'Por qué lo eliges (opcional)', privateNote:'Solo la persona que creó esta votación verá tu nombre y tu respuesta.',
  submitting:'Enviando tu voto…', voted:'Tu elección está guardada:', change:'Todavía puedes cambiar tu elección.', closed:'La votación ha terminado',
  unavailable:'Este enlace ya no está disponible', temporary:'La votación no está disponible temporalmente', limited:'Demasiados intentos. Vuelve a intentarlo en', seconds:'segundos.', retry:'Volver a intentar',
  cookie:'Permite las cookies de este sitio para guardar un voto por dispositivo y vuelve a intentarlo.', invalid:'Revisa tu nombre (40 caracteres) y tu respuesta (160 caracteres).',
  pitch:'Margot elige tu conjunto cada mañana. Con la ropa que ya tienes', download:'Descubre Margot', appStore:'App Store', playStore:'Google Play', copy:'Copiar el enlace', copied:'Enlace copiado', copyFailed:'No se ha podido copiar. Puedes seleccionar este enlace para copiarlo.', piece:'Prenda',
 },
} satisfies Record<VoteLocale, Record<string,string>>;
