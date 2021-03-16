#!usr/bin/env node
import { program } from 'commander';
import { serveCommand } from './commands/serve';

program.addCommand(serveCommand);

//argv is command line arguements built in to node.js
program.parse(process.argv);