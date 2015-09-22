/*!
 * Nom: messageSaver
 * Version: 1.2
 * Description: Permet l'enregistrement automatique des messages dans les champs de post de forumactif
 * Auteur: Emmanuel "Manumanu" B
 * GitHub: https://github.com/EmmanuelBeziat/forumactif-messageSaver
 */

/**
 * Fonction principale
 * @return {[function]}           [Fonction Init]
 */
var messageSaver = (function($, undefined) {
	"use strict";

	/**
	 * Parse l'url actuelle pour récupérer l'ID du sujet
	 * @param  {string} sID [code de la page en cours]
	 * @return {string}      [ID de la page en cours]
	 */
	var getTopicID = function(sID) {
		sID = sID.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
		var sRegexpModel = "[\\?&]" + sID + "=([^&#]*)",
			oRegex = new RegExp(sRegexpModel),
			aRegexResults = oRegex.exec(window.location.href),
			sTopicID = $('#text_editor_textarea').siblings('input[name="'+sID+'"]').val();

		return (aRegexResults === null) ? sTopicID : aRegexResults[1];
	};

	/**
	 * Enregistre le message en cours d'édition dans le WebStorage du navigateur
	 * @param  {string} sUserID    [nom d'utilisateur]
	 * @param  {string} sFormMessage [message en cours d'écriture]
	 * @param  {string} sForumURL    [url du forum]
	 * @param  {string} sTopicID    [ID du sujet en cours]
	 */
	var savePost = function(sUserID, sFormMessage, sForumURL, sTopicID) {
		var oMessageSaved = {
			userID: sUserID,
			topicURL: sTopicID,
			message: sFormMessage
		};

		localStorage.setItem(sForumURL, JSON.stringify(oMessageSaved));
	};

	/**
	 * Charger le message stocké dans le WebStorage du navigateur
	 * @param  {string} sUserID 	[nom d'utilisateur]
	 * @param  {object jQuery} $FormMessage	[champ de texte d'écriture]
	 * @param  {string} sForumURL	[url du forum]
	 * @param  {string} sTopicID	[ID du sujet en cours]
	 */
	var loadPost = function(sUserID, $FormMessage, sForumURL, sTopicID) {
		var oMessageLoaded,
			sErrorMessage = "\nIl n'y a pas de message à charger.",
			sMessageSaved = localStorage.getItem(sForumURL);

		if (sMessageSaved != "undefined") {
			oMessageLoaded = JSON.parse(sMessageSaved);

			// Si un message a été enregistré, récupérer le contenu
			if (checkMessageSaved(sUserID, $FormMessage.val(), sForumURL, sTopicID)) {
				$FormMessage.val(oMessageLoaded.message);
			}
			else {
				alert("Erreur 1:\nLa vérification du message enregistré a échoué.");
			}
		}
		else
			alert("Erreur 2: Il n'y a aucun message sauvegardé dans le WebStorage");
	};

	/**
	 * Vérifier s'il existe un message sauvegardé pour le sujet en cours
	 * @param  {string} sUserID      [id d'utilisateur]
	 * @param  {string} sFormMessage [ùessage e, cpirs d'écrotire]
	 * @param  {string} sForumURL    [url du forum]
	 * @param  {string} sTopicID    [ID du sujet en cours]
	 * @return {booleen}             [renvoie true s'il y a une occurence]
	 */
	var checkMessageSaved = function(sUserID, sFormMessage, sForumURL, sTopicID) {
		var oMessageLoaded,
			sMessageSaved = localStorage.getItem(sForumURL);

		if (sMessageSaved != "undefined") {
			oMessageLoaded = JSON.parse(sMessageSaved);

			return (oMessageLoaded.userID === sUserID && oMessageLoaded.topicURL === sTopicID && sFormMessage === '') ? true : false;
		} else
			return false;
	};

	/**
	 * Initialisation du script
	 */
	var init = function() {
		var sForumURL = window.location.host,
			sUserID = _userdata.user_id,
			sTopicID = getTopicID("t"),
			$FormPost = $('form[action="/post"]'),
			$FormSubmit = $FormPost.find('input[name="post"]'),
			$FormMessage = $("#text_editor_textarea").sceditor("instance");

		// Enregistre le texte ajouté au fur et à mesure
		$FormMessage.bind("keyup", function() {
			savePost(sUserID, $FormMessage.val(), sForumURL, sTopicID);
		});

		// Ajouter un bouton de chargement si un élément a été trouvé
		if (localStorage.getItem(sForumURL)) {
			$FormSubmit.before('<input type="button" class="mainoption btn-loader" id="ms-loader" value="Charger le message sauvegardé" />&nbsp;&nbsp;');
		}

		// Charger le texte enregistré dans le champ de formulaire
		$FormPost.on("click", "#ms-loader", function() {
			loadPost(sUserID, $FormMessage, sForumURL, sTopicID);
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
	if (typeof(_userdata) == "undefined") {
		console.log("L'objet \"_userdata\" de forumactif n'a pas été trouvé. Le script de sauvegarde des messages en cours d'écriture ne peut pas fonctionner.");
	}
	else {
		messageSaver.init();
	}
});