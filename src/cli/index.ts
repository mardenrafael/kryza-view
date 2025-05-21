#!/usr/bin/env ts-node

import fs from "fs";
import path from "path";
import inquirer from "inquirer";
import { spawn } from "child_process";

const SCRIPTS_PATH = path.join(__dirname, "../bin");

async function main() {
  try {
    const files = fs
      .readdirSync(SCRIPTS_PATH)
      .filter((file) => file.endsWith(".ts"));

    if (files.length === 0) {
      console.log("Nenhum script encontrado na pasta /bin");
      return;
    }

    const { selectedScript } = await inquirer.prompt([
      {
        type: "list",
        name: "selectedScript",
        message: "Selecione um script para rodar:",
        choices: files.map((file, index) => ({
          name: `${index + 1} - ${file}`,
          value: file,
        })),
      },
    ]);

    const scriptPath = path.join(SCRIPTS_PATH, selectedScript);
    console.log(`Executando: ${selectedScript}`);

    const child = spawn(
      "ts-node",
      ["--project", "tsconfig.cli.json", scriptPath],
      {
        stdio: "inherit",
      }
    );

    child.on("close", (code) => {
      console.log(`Script finalizado com código: ${code}`);
    });
  } catch (error) {
    console.error("Erro ao listar/executar scripts:", error);
  }
}

main();
