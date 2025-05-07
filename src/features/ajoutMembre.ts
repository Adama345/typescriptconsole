import { Groupe} from "../model";
import { loadGroupe, savegroupe, loadUser } from "../depenseManager";
import inquirer from "inquirer";

export async function ajouterMembreAuGroupe(groupe: Groupe) {
    const { users } = loadUser();

    if (!users || users.length === 0) {
        console.log("Aucun utilisateur trouvé.");
        return;
    }

    // Affiche les utilisateurs disponibles
    users.forEach((user) => {
        console.log(`- ${user.nom} ${user.prenom} | Téléphone: ${user.telephone}`);
    });

    const { telephone } = await inquirer.prompt([
        {
            type: "input",
            name: "telephone",
            message: "Entrez le numéro de téléphone de l'utilisateur à ajouter au groupe :",
            validate: (input: string) => {
                const user = users.find(u => u.telephone === input);
                if (!user) return "Numéro introuvable.";
                if (user.id === groupe.id) return "❌ Vous êtes déjà chef du groupe.";
                return true;
            },
        },
    ]);

    const utilisateurChoisi = users.find(user => user.telephone === telephone)!;

    if (!groupe.membreId) {
        groupe.membreId = [];
    }

    if (!groupe.membreId.includes(utilisateurChoisi.id)) {
        groupe.membreId.push(utilisateurChoisi.id);
        console.log(`${utilisateurChoisi.nom} ${utilisateurChoisi.prenom} a été ajouté au groupe "${groupe.nom}".`);
    } else {
        console.log("L'utilisateur est déjà membre de ce groupe.");
    }

    // Mise à jour et sauvegarde du groupe
    const { groupes } = loadGroupe();
    const index = groupes.findIndex(g => g.id === groupe.id);
    if (index !== -1) {
        groupes[index] = groupe;
        savegroupe(groupes);
    }
}

