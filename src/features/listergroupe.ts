import {loadGroupe}  from "../depenseManager"
import inquirer from "inquirer";
import {Groupe} from "../model"

//afficher du groupe
const groupes:Groupe[] = loadGroupe();

export async function listerGroupes(groupe : Groupe[] ) : Promise<void> {
    console.log("Liste des groupes : ");
    groupes.forEach(groupe => {
        console.log ('nom: ${groupe.nom}');
        console.log('membres:${groupe.membres.join(', ')})');
        
    });
}
 
if (groupes.length >0) {
    listerGroupes (groupes) ;

} else {
    console.log("Aucun groupe trouvé")
}

