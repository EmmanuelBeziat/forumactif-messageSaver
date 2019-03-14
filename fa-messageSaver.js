/*!
 * Nom: fa-messageSaver
 * Version: 1.2
 * Description: Permet l'enregistrement automatique des messages dans les champs de post de forumactif
 * Auteur: Emmanuel Beziat
 * GitHub: https://github.com/EmmanuelBeziat/forumactif-messageSaver
 */

/**
 * Fonction principale
 * @return {[function]}           [Fonction Init]
 */

const messageSaver = ($ => {
	'use strict'

	/**
	 * Parse l'url actuelle pour récupérer l'ID du sujet
	 * @param  {string} sID [code de la page en cours]
	 * @return {string}      [ID de la page en cours]
	 */
	const getTopicID = (sID) => {
		sID = sID.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]")
		const sRegexpModel = "[\\?&]" + sID + "=([^&#]*)"
		const oRegex = new RegExp(sRegexpModel)
		const aRegexResults = oRegex.exec(window.location.href)
		const sTopicID = $('#text_editor_textarea').siblings('input[name="'+sID+'"]').val()

		return (aRegexResults === null) ? sTopicID : aRegexResults[1]
	}

	/**
	 * Enregistre le message en cours d'édition dans le WebStorage du navigateur
	 * @param  {string} sUserID    [nom d'utilisateur]
	 * @param  {string} sFormMessage [message en cours d'écriture]
	 * @param  {string} sForumURL    [url du forum]
	 * @param  {string} sTopicID    [ID du sujet en cours]
	 */
	const savePost = (sUserID, sFormMessage, sForumURL, sTopicID) => {
		const oMessageSaved = {
			userID: sUserID,
			topicURL: sTopicID,
			message: sFormMessage
		}

		localStorage.setItem(sForumURL, JSON.stringify(oMessageSaved))
	}

	/**
	 * Charger le message stocké dans le WebStorage du navigateur
	 * @param  {string} sUserID 	[nom d'utilisateur]
	 * @param  {object jQuery} $formMessage	[champ de texte d'écriture]
	 * @param  {string} sForumURL	[url du forum]
	 * @param  {string} sTopicID	[ID du sujet en cours]
	 */
	const loadPost = (sUserID, $formMessage, sForumURL, sTopicID) => {
		const sMessageSaved = localStorage.getItem(sForumURL)

		if (sMessageSaved != 'undefined') {
			const oMessageLoaded = JSON.parse(sMessageSaved)

			// Si un message a été enregistré, récupérer le contenu
			if (checkMessageSaved(sUserID, $formMessage.val(), sForumURL, sTopicID)) {
				$formMessage.val(oMessageLoaded.message)
			}
			else {
				alert('Erreur 1: La vérification du message enregistré a échoué.')
			}
		}
		else
			alert('Erreur 2: Il n’y a aucun message sauvegardé.')
	}

	/**
	 * Vérifier s'il existe un message sauvegardé pour le sujet en cours
	 * @param  {string} sUserID      [id d'utilisateur]
	 * @param  {string} sFormMessage [ùessage e, cpirs d'écrotire]
	 * @param  {string} sForumURL    [url du forum]
	 * @param  {string} sTopicID    [ID du sujet en cours]
	 * @return {booleen}             [renvoie true s'il y a une occurence]
	 */
	const checkMessageSaved = (sUserID, sFormMessage, sForumURL, sTopicID) => {
		const sMessageSaved = localStorage.getItem(sForumURL)

		if (sMessageSaved != 'undefined') {
			const oMessageLoaded = JSON.parse(sMessageSaved)

			return (oMessageLoaded.userID === sUserID && oMessageLoaded.topicURL === sTopicID && sFormMessage === '') ? true : false
		}
		else {
			return false
		}
	}

	/**
	 * Initialisation du script
	 */
	const init = () => {
		const sForumURL = window.location.host
		const sUserID = _userdata.user_id
		const sTopicID = getTopicID('t')
		const $formPost = $('form[action="/post"]')
		const $formSubmit = $formPost.find('input[name="post"]')
		const $formMessage = $('#text_editor_textarea').sceditor('instance')

		// Enregistre le texte ajouté au fur et à mesure
		$formMessage.bind("keyup", () => {
			savePost(sUserID, $formMessage.val(), sForumURL, sTopicID)
		})

		// Ajouter un bouton de chargement si un élément a été trouvé
		if (localStorage.getItem(sForumURL)) {
			$formSubmit.before('<input type="button" class="mainoption btn-loader" id="ms-loader" value="Charger le message sauvegardé" />&nbsp&nbsp')
		}

		// Charger le texte enregistré dans le champ de formulaire
		$formPost.on('click', '#ms-loader', () => {
			loadPost(sUserID, $formMessage, sForumURL, sTopicID)
		})
	}

	/**
	 * Appel de l'initialisation
	 */
	return {
		init: init
	}

})(jQuery)

/**
 * Attend le chargement complet de la page (et non du DOM)
 * pour permettre le chargement préalable de l'éditeur JS
 */
$(window).load(() => {

	// Lancer le script uniquement si les constiables forumactifs sont bien initialisées
	if (typeof(_userdata) == 'undefined') {
		console.log('L’objet "_userdata" de forumactif n’a pas été trouvé. Le script de sauvegarde des messages en cours d’écriture ne peut pas fonctionner.')
	}
	else {
		messageSaver.init()
	}
})
