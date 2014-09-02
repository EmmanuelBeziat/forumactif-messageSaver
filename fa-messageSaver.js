/**
 * Nom: messageSaver
 * Version: 1.0
 * Description: Permet l'enregistrement automatique des messages dans les champs de post de forumactif
 * Auteur: Emmanuel "Manumanu" B
 * GitHub: https://github.com/RhooManu/forumactif-messageSaver
 */

/**
 * Fonction principale
 * @return {[function]}           [Fonction Init]
 */
var messageSaver = (function($, undefined) {
	"use strict";

	/**
	 * Parse l'url actuelle pour récupérer l'ID du sujet
	 * @param  {string} sURL [url de la page en cours]
	 * @return {string}      [id de la page en cours]
	 */
	var urlParse = function(sURL) {
		sURL = sURL.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
		var sRegexpModel = "[\\?&]" + sURL + "=([^&#]*)",
			oRegex = new RegExp(sRegexpModel),
			aRegexResults = oRegex.exec(window.location.href);

		return (aRegexResults === null) ? null : aRegexResults[1];
	};

	/**
	 * Enregistre le message en cours d'édition dans le WebStorage du navigateur
	 * @param  {string} sUsername    [nom d'utilisateur]
	 * @param  {string} sFormMessage [message en cours d'écriture]
	 * @param  {string} sForumURL    [url du forum]
	 * @param  {string} sTopicURL    [url du sujet en cours]
	 */
	var savePost = function(sUsername, sFormMessage, sForumURL, sTopicURL) {
		var oMessageSaved = {
			username: sUsername,
			topicURL: sTopicURL,
			message: sFormMessage
		};

		localStorage.setItem(sForumURL, JSON.stringify(oMessageSaved));
	};

	/**
	 * Charger le message stocké dans le WebStorage du navigateur
	 * @param  {string} sUsername    [nom d'utilisateur]
	 * @param  {object jQuery} $FormMessage [champ de texte d'écriture]
	 * @param  {string} sForumURL    [url du forum]
	 * @param  {string} sTopicURL    [url du sujet en cours]
	 */
	var loadPost = function(sUsername, $FormMessage, sForumURL, sTopicURL) {
		var oMessageLoaded,
			sMessageSaved = localStorage.getItem(sForumURL);

		// Si un message a été enregistré, récupérer le contenu
		if (sMessageSaved != "undefined") {
			oMessageLoaded = JSON.parse(sMessageSaved);

			// Si le message correspond bien au forum actuel, à ce nom d'utilisateur, et au sujet en cours,
			// Charger le contenu du message dans le champ de texte
			if (oMessageLoaded.username === sUsername && oMessageLoaded.topicURL === sTopicURL && $FormMessage.val() === '')
				$FormMessage.val(oMessageLoaded.message);
		}
	};

	/**
	 * Initialisation du script
	 */
	var init = function() {
		var sForumURL = window.location.host,
			sUsername = _userdata.username,
			sTopicURL = urlParse("t"),
			$FormPost = $('form[action="/post"]').not("#quick_reply"),
			$FormSubmit = $FormPost.find('input[name="post"]'),
			$FormMessage = $(".sceditor-container textarea");

		// Enregistre le texte ajouté au fur et à mesure
		$FormMessage.bind("input", function() {
			savePost(sUsername, $FormMessage.val(), sForumURL, sTopicURL);
		});

		// Ajouter un bouton de chargement si un élément a été trouvé
		if (localStorage.getItem(sForumURL)) {
			$FormSubmit.before('<input type="button" class="mainoption btn-loader" id="ms-loader" value="Charger le message sauvegardé" />&nbsp;&nbsp;');
		}

		// Charger le texte enregistré dans le champ de formulaire
		$FormPost.on("click", "#ms-loader", function() {
			loadPost(sUsername, $FormMessage, sForumURL, sTopicURL);
		});
	};

	/**
	 * Appel de l'initialisation
	 */
	return {
		init: init
	};

})(jQuery);

/**
 * Attend le chargement complet de la page (et non du DOM)
 * pour permettre le chargement préalable de l'éditeur JS
 */
$(window).load(function() {

	// Lancer le script uniquement si les variables forumactifs sont bien initialisées
	(typeof(_userdata) == "undefined") ?
		console.log("L'objet \"_userdata\" de forumactif n'a pas été trouvé. Le script de sauvegarde des messages en cours d'écriture ne peut pas fonctionner.") :
		messageSaver.init();
});
