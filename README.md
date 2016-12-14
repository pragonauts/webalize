# Webalize text/url utils

Collection of text and url processing functions

-----------------

# API
## Functions

<dl>
<dt><a href="#looksLikeFile">looksLikeFile(urlParam)</a> ⇒ <code>boolean</code></dt>
<dd><p>Filters file urls from template urls</p>
</dd>
<dt><a href="#webalize">webalize(str)</a> ⇒ <code>string</code></dt>
<dd></dd>
<dt><a href="#camelcaseToWebalized">camelcaseToWebalized(str)</a> ⇒ <code>string</code></dt>
<dd><p>Makes url nice.</p>
</dd>
<dt><a href="#toCamelCase">toCamelCase(str, [withDiacritics])</a> ⇒ <code>string</code></dt>
<dd><p>Makes camelcase from nice url (reverse to camelcaseToWebalized)</p>
</dd>
<dt><a href="#webalizeChunks">webalizeChunks(string, [separator])</a> ⇒ <code>string</code></dt>
<dd><p>Makes nice url from template path</p>
</dd>
<dt><a href="#camelCaseChunks">camelCaseChunks(string, [separator])</a> ⇒ <code>string</code></dt>
<dd><p>Parses url path to template path</p>
</dd>
<dt><a href="#asTemplateUrl">asTemplateUrl(path, urlParam, homeView, [notFoundView])</a> ⇒ <code>string</code> | <code>null</code></dt>
<dd><p>Makes template path when possible, otherwise returns notFoundView</p>
</dd>
<dt><a href="#withParams">withParams(urlParam)</a> ⇒ <code>string</code></dt>
<dd><p>Adds parameter to querystring or hash</p>
</dd>
<dt><a href="#replaceDiacritics">replaceDiacritics(str)</a> ⇒ <code>string</code></dt>
<dd><p>Replaces all diacritics</p>
</dd>
</dl>

<a name="looksLikeFile"></a>

## looksLikeFile(urlParam) ⇒ <code>boolean</code>
Filters file urls from template urls

**Kind**: global function  

| Param | Type |
| --- | --- |
| urlParam | <code>any</code> | 

**Example**  
```javascript
url.looksLikeFile('/assets/img/some_image.png?v=132') // === true
```
<a name="webalize"></a>

## webalize(str) ⇒ <code>string</code>
**Kind**: global function  

| Param | Type |
| --- | --- |
| str | <code>string</code> | 

**Example**  
```javascript
url.webalize('-Ňějaký čupr', true) // === 'nejaky-cupr'
```
<a name="camelcaseToWebalized"></a>

## camelcaseToWebalized(str) ⇒ <code>string</code>
Makes url nice.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| str | <code>string</code> | Should not start with lowercase character |

**Example**  
```javascript
url.camelcaseToWebalized('helloWorld') // === 'hello-world'
```
<a name="toCamelCase"></a>

## toCamelCase(str, [withDiacritics]) ⇒ <code>string</code>
Makes camelcase from nice url (reverse to camelcaseToWebalized)

**Kind**: global function  

| Param | Type | Default |
| --- | --- | --- |
| str | <code>string</code> |  | 
| [withDiacritics] | <code>boolean</code> | <code>false</code> | 

**Example**  
```javascript
url.toCamelCase('ŇěJaký čupr', true) // === 'nejakyCupr'
```
<a name="webalizeChunks"></a>

## webalizeChunks(string, [separator]) ⇒ <code>string</code>
Makes nice url from template path

**Kind**: global function  

| Param | Type | Default |
| --- | --- | --- |
| string | <code>string</code> |  | 
| [separator] | <code>string</code> | <code>&quot;&#x27;/&#x27;&quot;</code> | 

**Example**  
```javascript
url.webalizeChunks('/blahBlah/haHa'), '/blah-blah/ha-ha'
```
<a name="camelCaseChunks"></a>

## camelCaseChunks(string, [separator]) ⇒ <code>string</code>
Parses url path to template path

**Kind**: global function  

| Param | Type | Default |
| --- | --- | --- |
| string | <code>string</code> |  | 
| [separator] | <code>string</code> | <code>&quot;&#x27;/&#x27;&quot;</code> | 

**Example**  
```javascript
url.camelCaseChunks('/blah-blah/ha-ha') // === '/blahBlah/haHa'
```
<a name="asTemplateUrl"></a>

## asTemplateUrl(path, urlParam, homeView, [notFoundView]) ⇒ <code>string</code> &#124; <code>null</code>
Makes template path when possible, otherwise returns notFoundView

**Kind**: global function  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| path | <code>string</code> |  | path part of url |
| urlParam | <code>string</code> |  | whole url |
| homeView | <code>any</code> |  | home view template for / path |
| [notFoundView] | <code>any</code> | <code></code> |  |

<a name="withParams"></a>

## withParams(urlParam) ⇒ <code>string</code>
Adds parameter to querystring or hash

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| urlParam | <code>string</code> |  |
| options.query | <code>Object</code> &#124; <code>null</code> | querystring object (null removes query) |
| options.hash | <code>Object</code> &#124; <code>null</code> | hash object (null removes hash) |

**Example**  
```javascript
const res = url.withParams('http://www.google.com?foo=1&bar=&x=hello', { query: { x: 1, y: 2 } });
assert.equal(res, 'http://www.google.com/?foo=1&bar=&x=1&y=2');
```
<a name="replaceDiacritics"></a>

## replaceDiacritics(str) ⇒ <code>string</code>
Replaces all diacritics

**Kind**: global function  

| Param | Type |
| --- | --- |
| str | <code>string</code> | 

