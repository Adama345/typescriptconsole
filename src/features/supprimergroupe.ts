import { Groupe, Utilisateur } from "../model";
import { loadGroupe, savegroupe } from "../depenseManager";
import inquirer from "inquirer";

export async function deleteGroup(groupe: Groupe) {
    const { groupes } = loadGroupe();
    // let mygroup = groupe.filter((j) => j.chefDeGroupe === user.id);

    // const { actionid } = await inquirer.prompt({
    //     type: "list",
    //     name: "actionid",
    //     message: "Quel groupe souhaitez vous supprimer ?",
    //     choices: mygroup.map((g) => ({ name: g.nom, value: g.id })),
    // });

    // mygroup = mygroup.filter((g)=>g.id !== actionid)

    const { confirm } = await inquirer.prompt([
        {
            type: "confirm",
            name: "confirm",
            message: `Voulez-vous vraiment supprimer le groupe "${groupe.nom}" ?`,
        },
    ]);
    if (confirm) {
        const newGroupes = groupes.filter((g) => g.id !== groupe.id);
        savegroupe(newGroupes);
        console.log("groupe supprimé !");
        return true;
    }
}
