#!/usr/bin/env node

import chalk from "chalk";
import ejs from "ejs";
import fs from "fs-extra";
import path from "path";
import program from "commander";
import * as packageJson from "../package.json";
import { exit } from "process";

interface data {
  resolver?: string;

  entity?: string;
}

const _write = async (
  fileTypeDir: string,
  fileType: string,
  fileName: string,
  data: string
) => {
  const filePath = path.join(process.cwd(), "src", fileTypeDir);
  const file = path.join(filePath, fileName + ".ts");

  if (fs.existsSync(filePath) == false) {
    fs.mkdirSync(filePath);
  }

  if (fs.existsSync(file) == false) {
    fs.writeFile(path.join(filePath, fileName + ".ts"), data).then(() => {
      console.log(chalk.green(`${fileType} has been created.`));
    });
  } else {
    console.log(chalk.red(`${fileName} already exists.`));
  }
};

const _generate = async (
  name: string,
  data: data,
  fileTypeDir: string,
  fileType: string,
  stub: string
) => {
  await ejs
    .renderFile(path.join(__dirname, `stubs/${stub}`), data)
    .then((content) => {
      _write(fileTypeDir, fileType, name, content);
    });
};

const entity = async (name: string) => {
  _generate(name, { entity: name }, "entity", "Entity", "entity.ejs");
};

const resolver = async (name: string) => {
  _generate(name, { resolver: name }, "resolvers", "Resolver", "resolver.ejs");
};

program
  .name(packageJson.name)
  .version(packageJson.version)
  .description(packageJson.version);

program
  .command("init <name>")
  .description("Creates initial typegraphql project")
  .action((name) => {
    if (fs.existsSync(path.join(process.cwd(), name))) {
      console.log(chalk.red("Project name already exists."));
      exit(1);
    }

    fs.copySync(
      path.join(__dirname, "..", "..", "node_modules", "tgql-make-base"),
      path.join(process.cwd(), name)
    );
    console.log(chalk.green(`${name} has been created. Enjoy!`));
  });

program
  .command("entity <name>")
  .description("Generates an entity")
  .action((name) => {
    entity(name);
  });

program
  .command("resolver <name>")
  .description("Generates a resolver")
  .action((name) => {
    resolver(name);
  });

program.parse(process.argv);
