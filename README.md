script messageSaver pour ForumActif
=======================

Qui n'a jamais hurlé de rage et saisi violemment son clavier pour battre à mort un innocent qui passait par là, lorsqu'un message de trouzmille cinq cent quatre lignes que vous étiez en train de rédiger est perdu à tout jamais parce que :

- Le forum plante bêtement au moment de l'envoi
- Votre navigateur se ferme sans explication (ni coups de semonce)
- Vous rechargez la page malencontreusement, ou revenez sur la précédente

Disons-le clairement : C'est chiant, et ça vous donne envie de retourner des bébés phoques comme de vulgaires chaussettes qui traîneraient dans votre panier à linge depuis deux mois.

> On connaît, on connaît. Et sinon, à part nous rappeler ces moments de douleur que l'on aimerait chasser de notre vie, tu voulais nous dire quoi ?

Hé bien mes bons, **j'ai la solution** !
Vous allez pouvoir écrire votre message en prenant autant de temps que vous le voulez. Vous allez pouvoir planter, fermer votre navigateur, redémarrer votre pc, puis revenir onze jours plus tard et retrouver votre message qui vous attendait sagement, à la virgule près. Le tout en permettant aux fondateurs de forums de quand même personnaliser leurs templates sans se soucier de la compatibilité de diverses classes.

> "Nom de dieu Manu, tu nous vends du rêve par transpalettes de 12 !"

Je sais, et la cerise sur le McParfait, c'est que ça tient en un seul petit script très facile à intégrer. Passons donc à la pratique.

# Comment ça marche ?

D'un point de vue utilisateur, c'est très simple : Celui-ci écrit tranquillement son message, et tout est normal. Si pour une raison ou une autre il doit revenir sur cette page sans avoir fini son message, un bouton apparaît entre "Prévisualiser" et "Envoyer" ; même dans le formulaire de réponse rapide !

![](http://img110.xooimage.com/files/e/2/e/exemple1-477058a.jpg)

Un petit clic sur ce dernier remplis le champ de texte avec le message sauvegardé en l'état.

**À noter cependant :**
- Dans certains cas (par exemple, revenir sur la page du message en cliquant sur le bouton "page suivante" du navigateur, le chargement est un peu altéré et le bouton est inactif. Il suffit de recharger à nouveau la page de post et tout fonctionne.
- Dans le cas d'une édition, appuyer sur le bouton remplacera le contenu actuel du champ d'écriture en totalité.
- Cela ne fonctionne qu'en réponse à un sujet déjà existant, pas à la création d'un nouveau sujet.

# Comment l'installer

1. Il suffit d'aller dans votre espace d'administration, Modules → HTML & Javascript → Gestion des codes Javascript.
2. Assurez-vous que "Activer la gestion des codes Javascript" est bien actif, puis cliquez sur "Créer un nouveau javascript".
3. Dans la nouvelle fenêtre, copiez-collez simplement ce code, tel quel :
```javascript
var messageSaver=function(e,t){"use strict";var n=function(t){t=t.replace(/[\[]/,"\\[").replace(/[\]]/,"\\]");var n="[\\?&]"+t+"=([^&#]*)",r=new RegExp(n),i=r.exec(window.location.href),s=e("#text_editor_textarea").siblings('input[name="'+t+'"]').val();return i===null?s:i[1]};var r=function(e,t,n,r){var i={userID:e,topicURL:r,message:t};localStorage.setItem(n,JSON.stringify(i))};var i=function(e,t,n,r){var i,o="\nIl n'y a pas de message à charger.",u=localStorage.getItem(n);if(u!="undefined"){i=JSON.parse(u);s(e,t.val(),n,r)?t.val(i.message):alert("Erreur 1:\nLa vérification du message enregistré a échoué.")}else alert("Erreur 2: Il n'y a aucun message sauvegardé dans le WebStorage")};var s=function(e,t,n,r){var i,s=localStorage.getItem(n);if(s!="undefined"){i=JSON.parse(s);return i.userID===e&&i.topicURL===r&&t===""?true:false}else return false};var o=function(){var t=window.location.host,s=_userdata.user_id,o=n("t"),u=e('form[action="/post"]'),a=u.find('input[name="post"]'),f=e("#text_editor_textarea").sceditor("instance");f.bind("keyup",function(){r(s,f.val(),t,o)});if(localStorage.getItem(t)){a.before('<input type="button" class="mainoption btn-loader" id="ms-loader" value="Charger le message sauvegardé" />&nbsp;&nbsp;')}u.on("click","#ms-loader",function(){i(s,f,t,o)})};return{init:o}}(jQuery);$(window).load(function(){typeof _userdata=="undefined"?console.log("L'objet \"_userdata\" de forumactif n'a pas été trouvé. Le script de sauvegarde des messages en cours d'écriture ne peut pas fonctionner."):messageSaver.init()})
```

Cochez la case "toutes les pages", valides, et c'est tout !

Notez cependant que le bouton possède une classe btn-loader que vous pouvez utiliser pour, par exemple, rendre le bouton plus visible via le CSS.

Exemple :
```css
.btn-loader {
   background: #a00000;
   color: #fff;
   text-shadow: 1px 0 0 rgba(0,0,0,.2)
}
```

## Une note sur la compatibilité

Ce script est prévu pour fonctionner sur tous les navigateurs principaux (*Internet Explorer à partir de la version 8, Chrome, Firefox, Opera et Safari*).

Cependant, il ne fonctionne pour l'instant que sur un forum phpBB2 (et éventuellement Invision, mais il faut que je teste).

# Évolutions

À terme, je voudrais évidemment rendre ce script compatible avec phpBB3 (et Invision s'il le faut).

Je songe aussi à ajouter de nouvelles fonctionnalités :
- Sauvegarde possible sur plusieurs sujets différents
- Sauvegarde du titre et du contenu en cas de nouveau sujet

Si vous avez d'autres fonctionnalités en tête, faites-le moi savoir.

Si vous êtes développeur JS et que vous souhaitez voir le code pour l'adapter à vos besoin ou travailler dessus et proposer des ajouts ou autres améliorations, vous pouvez *forker*.

**Enjoy !**

## Remerciements
- *Nihil Scar Winspeare* pour ses suggestions concernant l'API SCEditor et l'id utilisateur