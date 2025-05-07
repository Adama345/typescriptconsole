import inquirer from "inquirer";
import { Depense, Groupe, Utilisateur } from "../model";
import { loadDepense, loadGroupe, loadUser, savedepense } from "../depenseManager";

export async function ajouterDepense(user: Utilisateur, groupeIdParam?: number) {
    const groupes: Groupe[] = loadGroupe().groupes;
    const depenses: Depense[] = loadDepense().depenses;
    const users: Utilisateur[] = loadUser().users;

    // Lister les groupes de l'utilisateur
    const mesGroupes = groupes.filter(
        g => g.chefDeGroupe === user.id || g.membreId?.includes(user.id)
    );

    if (mesGroupes.length === 0) {
        console.log("❌ Vous n'êtes membre d'aucun groupe.");
        return;
    }

    // Sélection ou usage direct du groupe
    let groupeId: number | undefined = groupeIdParam;

    if (!groupeId) {
        const { groupeId: selectedGroupeId } = await inquirer.prompt([
            {
                type: "list",
                name: "groupeId",
                message: "Dans quel groupe voulez-vous ajouter une dépense ?",
                choices: mesGroupes.map(g => ({ name: g.nom, value: g.id }))
            }
        ]);
        groupeId = selectedGroupeId;
    }

    // TypeScript : on est maintenant sûr que groupeId est défini
    const groupe = groupes.find(g => g.id === groupeId!);
    if (!groupe) {
        console.log("❌ Groupe introuvable.");
        return;
    }

    // Saisie des infos de la dépense
    const { nom, montant } = await inquirer.prompt([
        {
            type: "input",
            name: "nom",
            message: "Nom de la dépense :",
            validate: input => input.trim() !== "" || "Le nom ne peut pas être vide."
        },
        {
            type: "number",
            name: "montant",
            message: "Montant de la dépense :",
            validate: value => {
                const num = Number(value);
                return num > 0 || "Le montant doit être supérieur à 0.";
            }
        }
    ]);

    const membres = users.filter(u => groupe.membreId?.includes(u.id));

    const { membresConcerne } = await inquirer.prompt([
        {
            type: "checkbox",
            name: "membresConcerne",
            message: "Quels membres sont concernés par cette dépense ?",
            choices: membres.map(m => ({
                name: `${m.prenom} (${m.telephone})`,
                value: m.id
            })),
            validate: selected => selected.length > 0 || "Veuillez sélectionner au moins un membre."
        }
    ]);

    const nouvelleDepense: Depense = {
        id: Date.now(),
        nom,
        montant: Number(montant),
        date: new Date(),
        chefDeGroupe: user.id,
        groupeId: groupeId!, // ici aussi, on force le type
        membreId: membresConcerne
    };

    depenses.push(nouvelleDepense);
    savedepense(depenses);
    console.log("✅ Dépense ajoutée avec succès !");
}
