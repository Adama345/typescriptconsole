import { Groupe,Utilisateur} from "../model";
import {loadGroupe, savegroupe}from"../depenseManager" ;
import inquirer from "inquirer";

const groupe: Groupe[] = loadGroupe()

export async function deleteGroup(user:Utilisateur) {
    let mygroup = groupe.filter((j)=> j.chefDeGroupe === user.id )

    const {actionid} =await inquirer.prompt({
        type:'list',
        name : "actionid",
        message : "Quel groupe souhaitez vous supprimer ?",
        choices : mygroup.map((g)=>({name:g.nom , value:g.id})),

    });

    mygroup = mygroup.filter((g)=>g.id !== actionid)
    savegroupe(mygroup)

}