/*
 * @author David Menger
 */
'use strict';

const replaceDiacritics = require('./replaceDiacritics');
const url = require('url');
const querystring = require('querystring');

/**
 * Filters file urls from template urls
 *
 * @param {any} urlParam
 * @returns {boolean}
 * @example
 * url.looksLikeFile('/assets/img/some_image.png?v=132') // === true
 */
function looksLikeFile (urlParam) {
    return !!urlParam.match(/\/[^\\]+\.[^\\]+($|\?)/);
}

/**
 *
 * @param {string} str
 * @returns {string}
 * @example
 * url.webalize('-Ňějaký čupr', true) // === 'nejaky-cupr'
 */
function webalize (str) {
    return replaceDiacritics(`${str}`)
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^[-\s]+|[-\s]+$/g, '')
        .replace(/--+/g, '-');
}

/**
 * Makes url nice.
 *
 * @param {string} str Should not start with lowercase character
 * @returns {string}
 * @example
 * url.camelcaseToWebalized('helloWorld') // === 'hello-world'
 */
function camelcaseToWebalized (str) {
    if (str.match(/^[A-Z]|[^a-zA-Z0-9-]+/)) {
        throw new Error('Not a camelcase string');
    }

    return str
        .replace(
            /[-a-zA-Z][A-Z0-9]/g,
            match => `${match[0]}-${match[1]}`
        )
        .replace(
            /[A-Z0-9][A-Z]/g,
            match => `${match[0]}-${match[1]}`
        )
        .replace(/^[-\s]+|[-\s]+$/g, '')
        .replace(/--+/g, '-')
        .toLowerCase();
}

/**
 * Makes camelcase from nice url (reverse to camelcaseToWebalized)
 *
 * @param {string} str
 * @param {boolean} [withDiacritics=false]
 * @returns {string}
 * @example
 * url.toCamelCase('ŇěJaký čupr', true) // === 'nejakyCupr'
 */
function toCamelCase (str, withDiacritics) {
    let preparedString = `${str}`;

    if (withDiacritics) {
        preparedString = replaceDiacritics(preparedString);
    }

    return preparedString
        .replace(/[^a-zA-Z0-9]+/g, '-')
        .replace(/^[-\s]+|[-\s]+$/g, '')
        .replace(/--+/g, '-')
        .toLowerCase()
        .replace(
            /-[a-z0-9]/ig,
            match => match[1].toUpperCase()
        );
}

/**
 * Makes nice url from template path
 *
 * @param {string} string
 * @param {string} [separator='/']
 * @returns {string}
 * @example
 * url.webalizeChunks('/blahBlah/haHa'), '/blah-blah/ha-ha'
 */
function webalizeChunks (string, separator) {
    if (typeof string !== 'string') {
        return '';
    }

    const useSeparator = separator || '/';

    return string.split(useSeparator)
        .map(part => camelcaseToWebalized(part))
        .join(useSeparator);
}

/**
 * Parses url path to template path
 *
 * @param {string} string
 * @param {string} [separator='/']
 * @returns {string}
 * @example
 * url.camelCaseChunks('/blah-blah/ha-ha') // === '/blahBlah/haHa'
 */
function camelCaseChunks (string, separator) {
    if (typeof string !== 'string') {
        return '';
    }

    const useSeparator = separator || '/';

    return string.split(useSeparator)
        .map(part => toCamelCase(part))
        .join(useSeparator);
}

/**
 * Makes template path when possible, otherwise returns notFoundView
 *
 * @param {string} path - path part of url
 * @param {string} urlParam - whole url
 * @param {any} homeView - home view template for / path
 * @param {any} [notFoundView=null]
 * @returns {string|null}
 */
function asTemplateUrl (path, urlParam, homeView, notFoundView) {
    let cleanUrl = path.replace(/^\/|\/$/g, '');

    if (!cleanUrl) {
        cleanUrl = homeView;
    } else if (cleanUrl === homeView || looksLikeFile(urlParam)) {
        cleanUrl = typeof notFoundView === 'undefined' ? null : notFoundView;
    }

    return camelCaseChunks(cleanUrl);
}

/**
 * Adds parameter to querystring or hash
 *
 * @param {string} urlParam
 * @param {Object|null} options.query querystring object (null removes query)
 * @param {Object|null} options.hash hash object (null removes hash)
 *
 * @returns {string}
 * @example
 * const res = url.withParams('http://www.google.com?foo=1&bar=&x=hello', { query: { x: 1, y: 2 } });
 * assert.equal(res, 'http://www.google.com/?foo=1&bar=&x=1&y=2');
 */
function withParams (urlParam, options) {
    const parsedUrl = url.parse(urlParam, true);

    if (typeof options.query !== 'undefined') {
        delete parsedUrl.search;
    }

    if (options.query) {
        Object.assign(parsedUrl.query, options.query);

    } else if (options.query === null) {
        parsedUrl.query = null;
    }

    if (options.hash) {

        if (typeof parsedUrl.hash === 'string' && parsedUrl.hash[0] === '#') {
            parsedUrl.hash = parsedUrl.hash.slice(1);
        }

        if (typeof parsedUrl.hash === 'string') {
            parsedUrl.hash = querystring.parse(parsedUrl.hash);
        } else {
            parsedUrl.hash = {};
        }

        parsedUrl.hash = Object.assign(parsedUrl.hash, options.hash);
        parsedUrl.hash = querystring.stringify(parsedUrl.hash);

    } else if (options.hash === null) {
        parsedUrl.hash = null;
    }

    return url.format(parsedUrl);
}

module.exports = {
    withParams,
    looksLikeFile,
    asTemplateUrl,
    webalize,
    replaceDiacritics,
    toCamelCase,
    webalizeChunks,
    camelCaseChunks,
    camelcaseToWebalized
};
