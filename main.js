'use strict';

var obsidian = require('obsidian');



class ExampleModal extends obsidian.Modal {

    constructor(app, message) {
        super(app);
        this.message = message;
    }

    onOpen() {
        let contentEl = this.contentEl;
        contentEl.setText(this.message);
    }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


class SpaceMonkeyPlugin extends obsidian.Plugin {
  async onload() {

    this.registerMarkdownPostProcessor((element, context) => {
      element.addEventListener("contextmenu", function (event) {

        const selection = window.getSelection().toString();

        if (selection) {
          const transformedSelection = selection.toUpperCase();
          const range = window.getSelection().getRangeAt(0);
          range.deleteContents();
          range.insertNode(document.createTextNode(transformedSelection));
          event.preventDefault();
        }
      });
    });

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    this.addCommand({
        id: 'space-monkey-command',
        name: 'Space Monkey',  // Remove all empty lines in selection

        editorCallback: (editor, view) => {

            const selection = editor.getSelection()

            // Split the text into an array of lines
            const lines = selection.split('\n');

            // Filter out the empty lines
            const nonEmptyLines = lines.filter(line => line.trim() !== '');

            // Join the non-empty lines back into a single string
            const result = nonEmptyLines.join('\n') + '\n';

            editor.replaceSelection(result);

        },
    });

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    this.addCommand({
        id: 'space-panda-command',
        name: 'Space Panda',  // Collapse blocks of 3 or more empty lines into 2, leaves single empty lines intact

        editorCallback: (editor, view) => {

            const selection = editor.getSelection()

            // Split the text into an array of lines
            const lines = selection.split('\n');

            let isInsideBlock = false;
            let blockCount = 0;
            let result = [];

            for (let i = 0; i < lines.length; i++) {
                console.log('')
                const line = lines[i].trim();

                if (line === '') {
                  if (!isInsideBlock) {
                    result.push(line);
                    isInsideBlock = true;
                    blockCount = blockCount + 1
                  } else {
                    if (blockCount < 2) {
                      result.push(line);
                      blockCount = blockCount + 1
                    }
                  }
                } else {
                  result.push(line);
                  isInsideBlock = false;
                  blockCount = 0
                }
              }

            const output = result.join('\n');

            editor.replaceSelection(output);

        },
    });


    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    this.addCommand({
        id: 'space-mouse-command',
        name: 'Space Mouse',  // Trim each of selected lines

        editorCallback: (editor, view) => {

            const sel = editor.getSelection()
            let result = [];

            // Split the text into an array of lines
            const lines = sel.split('\n');

            for (let i = 0; i < lines.length; i++) {

                const line = lines[i].trim();
                result.push(line)

            }

            const output = result.join('\n');

            editor.replaceSelection(output);

        },
    });

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    this.addCommand({
        id: 'space-porcupine-command',
        name: 'Space Porcupine',

        editorCallback: (editor, view) => {

            const selection = editor.getSelection()

            // Split the text into an array of lines
            let lines = selection.split('\n');

            const regex = /^(- \[.\] .*|\s*)$/;

            const invalidLines = lines.reduce((invalidIndices, line, index) => {
              if (!regex.test(line)) {
                invalidIndices.push(index + 1);
                console.log(`>>>${line}<<<`)
              }
              return invalidIndices;
            }, []);

            if (invalidLines.length === 0) {
              console.log('All lines are valid.');
            } else {
              console.log('The following lines are not valid:', invalidLines.join(', '));

              const modal = new ExampleModal(app, "Cannot proceed to rearrange selected list, lines are not similar " +
                  "(different indentations etc)!");
              modal.open();
              return;
            }

            lines = lines.filter(line => line.trim() !== '');

            lines.sort((a, b) => {
                const charA = a.charAt(3);
                const charB = b.charAt(3);
                console.log(`>>>${charA}-${charB}<<<`)
                return charB.localeCompare(charA);
            });


            const result = lines.join('\n') + '\n';

            editor.replaceSelection(result);

        },
    });

  }
}

module.exports = SpaceMonkeyPlugin;


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// hotkeys: [{ modifiers: ["Mod", "Shift"], key: "a" }],
// https://marcus.se.net/obsidian-plugin-docs/user-interface/commands#editor-commands

// const mouse_sel = editor.getSelection()
// console.log(`You have selected: ${mouse_sel}`);