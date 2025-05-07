import inquirer from "inquirer";
import chalk from "chalk";
import { loadData, saveData } from "../depenseManager";
import { Payer, Utilisateur } from "../model";

export async function menuPaiements(utilisateur: Utilisateur) {
    const data = loadData();

    // Trouver les groupes où l'utilisateur est membre
    const groupes = data.groups.filter(
        (g) =>
            g.membreId?.includes(utilisateur.id) ||
            g.chefDeGroupe === utilisateur.id
    );

    if (groupes.length === 0) {
        console.log(chalk.yellow("Vous ne faites partie d'aucun groupe."));
        return;
    }

    // Trouver les dépenses de ces groupes
    const depenses = data.depenses.filter((d) =>
        groupes.some((g) => g.chefDeGroupe === d.chefDeGroupe)
    );

    if (depenses.length === 0) {
        console.log(chalk.yellow("Aucune dépense disponible pour paiement."));
        return;
    }

    const { depenseId } = await inquirer.prompt([
        {
            type: "list",
            name: "depenseId",
            message: "Sélectionnez une dépense à payer:",
            choices: depenses.map((d) => ({
                name: `${d.nom} - ${d.montant} FCFA (${new Date(
                    d.date
                ).toLocaleDateString()})`,
                value: d.id,
            })),
        },
    ]);

    await processPaiement(depenseId, utilisateur.id);
}

async function processPaiement(depenseId: number, membreId: number) {
    const data = loadData();
    const depense = data.depenses.find((d) => d.id === depenseId);

    if (!depense) {
        console.log(chalk.red("Dépense non trouvée."));
        return;
    }

    // Vérifier si l'utilisateur fait partie des membres concernés par la dépense
    if (depense.membreId && !depense.membreId.includes(membreId)) {
        console.log(chalk.red("Vous n'êtes pas concerné par cette dépense."));
        return;
    }

    // Calculer la part de l'utilisateur
    const nbParticipants = depense.membreId?.length || 1;
    const part = depense.montant / nbParticipants;

    // Calculer ce qui a déjà été payé
    const paiements = data.Payer.filter(
        (p) => p.depenseId === depense.id && p.membreId === membreId
    );
    const totalPaye = paiements.reduce((sum, p) => sum + p.sold, 0);
    const resteAPayer = part - totalPaye;

    if (resteAPayer <= 0) {
        console.log(
            chalk.green("Vous avez déjà payé votre part pour cette dépense.")
        );
        return;
    }

    console.log(chalk.blue(`\nDépense: ${depense.nom}`));
    console.log(chalk.blue(`Montant total: ${depense.montant} FCFA`));
    console.log(chalk.blue(`Votre part: ${part.toFixed(2)} FCFA`));
    console.log(chalk.blue(`Déjà payé: ${totalPaye.toFixed(2)} FCFA`));
    console.log(chalk.blue(`Reste à payer: ${resteAPayer.toFixed(2)} FCFA`));

    const { montant, methode } = await inquirer.prompt([
        {
            type: "number",
            name: "montant",
            message: "Montant à payer:",
            validate: (input: unknown) => {
                // Utilisez 'unknown' comme type d'entrée
                // Conversion et validation en toute sécurité
                const amount = Number(input);
                if (isNaN(amount)) return "Veuillez entrer un nombre valide";
                if (amount <= 0) return "Le montant doit être positif";
                if (amount > resteAPayer)
                    return `Le montant ne peut pas dépasser ${resteAPayer.toFixed(
                        2
                    )}`;
                return true;
            },
            filter: (input: unknown) => {
                // S'assure que la valeur est convertie en nombre
                return Number(input);
            },
        },
        {
            type: "list",
            name: "methode",
            message: "Méthode de paiement:",
            choices: [
                { name: "Espèces", value: "espèces" },
                { name: "Mobile Money", value: "mobile_money" },
                { name: "Carte bancaire", value: "carte_bancaire" },
            ],
        },
    ]);
    const nouveauPaiement: Payer = {
        id: Date.now(),
        date: new Date(),
        sold: montant,
        membreId,
        depenseId,
        statut: "validé",
        methode,
    };

    data.Payer.push(nouveauPaiement);
    saveData(data);

    console.log(
        chalk.green(`\n✅ Paiement de ${montant} FCFA enregistré avec succès!`)
    );
    console.log(chalk.green(`Méthode: ${methode}`));
    console.log(chalk.green(`Date: ${nouveauPaiement.date.toLocaleString()}`));
}

export function afficherPaiementsUtilisateur(utilisateurId: number) {
    const data = loadData();
    const paiements = data.Payer.filter((p) => p.membreId === utilisateurId);

    if (paiements.length === 0) {
        console.log(chalk.yellow("Aucun paiement enregistré."));
        return;
    }

    console.log(chalk.blue("\n=== VOS PAIEMENTS ==="));

    paiements.forEach((p) => {
        const depense = data.depenses.find((d) => d.id === p.depenseId);
        console.log(chalk.blue(`\nDépense: ${depense?.nom || "Inconnue"}`));
        console.log(`Montant: ${p.sold} FCFA`);
        console.log(`Date: ${p.date.toLocaleDateString()}`);
        console.log(`Méthode: ${p.methode || "Non spécifiée"}`);
        console.log(`Statut: ${p.statut}`);
    });
}

export function validerPaiements(chefDeGroupeId: number) {
    const data = loadData();

    // Trouver les paiements en attente pour les groupes où l'utilisateur est chef
    const groupes = data.groups.filter(
        (g) => g.chefDeGroupe === chefDeGroupeId
    );
    const depenses = data.depenses.filter((d) =>
        groupes.some((g) => g.chefDeGroupe === d.chefDeGroupe)
    );

    const paiementsEnAttente = data.Payer.filter(
        (p) =>
            depenses.some((d) => d.id === p.depenseId) &&
            p.statut === "en_attente"
    );

    if (paiementsEnAttente.length === 0) {
        console.log(chalk.yellow("Aucun paiement en attente de validation."));
        return;
    }

    console.log(chalk.blue("\n=== PAIEMENTS EN ATTENTE ==="));

    paiementsEnAttente.forEach((p) => {
        const depense = data.depenses.find((d) => d.id === p.depenseId);
        const membre = data.users.find((u) => u.id === p.membreId);

        console.log(chalk.blue(`\nDépense: ${depense?.nom || "Inconnue"}`));
        console.log(`Membre: ${membre?.prenom} ${membre?.nom}`);
        console.log(`Montant: ${p.sold} FCFA`);
        console.log(`Date: ${p.date.toLocaleDateString()}`);
        console.log(`Méthode: ${p.methode || "Non spécifiée"}`);
    });

    inquirer
        .prompt([
            {
                type: "list",
                name: "action",
                message: "Que voulez-vous faire?",
                choices: [
                    { name: "Valider un paiement", value: "valider" },
                    { name: "Refuser un paiement", value: "refuser" },
                    { name: "Retour", value: "retour" },
                ],
            },
        ])
        .then((answer) => {
            if (answer.action === "retour") return;

            inquirer
                .prompt([
                    {
                        type: "list",
                        name: "paiementId",
                        message: "Sélectionnez un paiement:",
                        choices: paiementsEnAttente.map((p) => {
                            const depense = data.depenses.find(
                                (d) => d.id === p.depenseId
                            );
                            const membre = data.users.find(
                                (u) => u.id === p.membreId
                            );
                            return {
                                name: `${depense?.nom} - ${membre?.prenom} ${membre?.nom} - ${p.sold} FCFA`,
                                value: p.id,
                            };
                        }),
                    },
                ])
                .then(async (selection) => {
                    const paiement = data.Payer.find(
                        (p) => p.id === selection.paiementId
                    );
                    if (!paiement) return;

                    if (answer.action === "valider") {
                        paiement.statut = "validé";
                        console.log(
                            chalk.green("Paiement validé avec succès!")
                        );
                    } else {
                        paiement.statut = "refusé";
                        console.log(chalk.yellow("Paiement refusé."));
                    }

                    saveData(data);

                    // Poser une question pour continuer
                    const { continuer } = await inquirer.prompt([
                        {
                            type: "confirm",
                            name: "continuer",
                            message: "Voulez-vous traiter un autre paiement?",
                            default: true,
                        },
                    ]);

                    if (continuer) {
                        validerPaiements(chefDeGroupeId);
                    }
                });
        });
}
