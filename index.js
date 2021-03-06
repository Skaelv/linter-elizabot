/**
 * @author Adam Hollett and Jeremy Hanson-Finger
 * @copyright 2016 Shopify
 * @license MIT
 * @module atom:linter:rorybot
 * @fileoverview Linter.
 */

/* global atom */
/* eslint-env node */

'use strict';

/*
 * Dependencies (rorybot is lazy-loaded later).
 */

var deps = require('atom-package-deps');
var minimatch = require('minimatch');
var elizabot;

/*
 * Constants.
 */

var config = atom.config;

/**
 * Activate.
 */
function activate() {
    deps.install('linter-elizabot');
}

/**
 * Atom meets rorybot to catch insensitive, inconsiderate
 * writing.
 *
 * @return {LinterConfiguration} - Configuration.
 */
function linter() {
    var CODE_EXPRESSION = /`([^`]+)`/g;

    /**
     * Transform a (stringified) vfile range to a linter
     * nested-tuple.
     *
     * @param {Object} location - Positional information.
     * @return {Array.<Array.<number>>} - Linter range.
     */
    function toRange(location) {
        return [[
            Number(location.start.line) - 1,
            Number(location.start.column) - 1
        ], [
            Number(location.end.line) - 1,
            Number(location.end.column) - 1
        ]];
    }

    /**
     * Transform a reason for warning from rorybot into
     * pretty HTML.
     *
     * @param {string} reason - Messsage in plain-text.
     * @return {string} - Messsage in HTML.
     */
    function toHTML(reason) {
        return reason.replace(CODE_EXPRESSION, '<code>$1</code>');
    }

    /**
     * Transform VFile messages
     * nested-tuple.
     *
     * @see https://github.com/wooorm/vfile#vfilemessage
     *
     * @param {VFileMessage} message - Virtual file error.
     * @return {Object} - Linter error.
     */
    function transform(message) {
        return {
          'type': 'Error',
          'html': toHTML(message.reason),
          'filePath': this.getPath(),
          'range': toRange(message.location)
      };
    }

    /**
     * Handle on-the-fly or on-save (depending on the
     * global atom-linter settings) events. Yeah!
     *
     * Loads `rorybot` on first invocation.
     *
     * @see https://github.com/atom-community/linter/wiki/Linter-API#messages
     *
     * @param {AtomTextEditor} editor - Access to editor.
     * @return {Promise.<Message, Error>} - Promise
     *  resolved with a list of linter-errors or an error.
     */
    function onchange(editor) {
        var settings = config.get('linter-elizabot');

        if (minimatch(editor.getPath(), settings.ignoreFiles)) {
            return [];
        }

        return new Promise(function (resolve, reject) {
            var messages;

            if (!elizabot) {
                elizabot = require('eliza-bot');
            }

            try {
                messages = elizabot(editor.getText()).messages;
            } catch (e) {
                reject(e);
                return;
            }

            resolve((messages || []).map(transform, editor));
        });
    }

    return {
        'grammarScopes': config.get('linter-elizabot').grammars,
        'name': 'elizabot',
        'scope': 'file',
        'lintOnFly': true,
        'lint': onchange
    };
}

/*
 * Expose.
 */

module.exports = {
    'config': {
        'ignoreFiles': {
            'description': 'Disable files matching (minimatch) glob',
            'type': 'string',
            'default': ''
        },
        'grammars': {
            'description': 'List of scopes for languages which will be ' +
                'checked. Note: setting new sources overwrites the ' +
                'defaults.',
            'type': 'array',
            'default': [
                'text.html.mustache',
                'source.hbs',
                'text.html.basic',
                'text.html.erb',
                'source.ruby.rails',
                'source.js',
                'source.json',
                'source.gfm',
                'text.html.ruby',
                'text.html.htmlbars',
                'text.plain'
            ]
        }
    },
    'provideLinter': linter,
    'activate': activate
};
