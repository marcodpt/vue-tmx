# vue-tmx 
Vue json based table with bootstrap3  
[Live Demo](http://marcodpt.github.io/tmx)
 - very easy to use, ready out of the box
 - filters
 - checkbox
 - aggregations like sum, avg, min, max
 - pagination
 - group by

```
npm install --save vue-tmx
```

## Usage
```javascript
  import Vue from 'vue'
  import tmx from 'vue-tmx'

  new Vue({
    components: {
      tmx: tmx,
      modal: modal,
    },
    data: {
      table: [/*My amazing data*/]
    }
  }).$mount('#app')
```

You must use with **bootstrap3** css, or send a pull request with other frameworks :)
```html
  <tmx :data="table" />
```

With modals
```javascript
  import {modal} from 'vue-transform'
```

```html
  <modal /> 
```
modal tag only one time in your app in any place

### Props
 - data
   - type: Array
   - default: none
   - description: if nothing is passed it will display loading icon, otherwise table data
 - fields
   - type: Array
   - default: none
   - description: Field description, if nothing is passed it will deduce based on your data
   - items (object):
     - id
       - type: String
       - default: ''
       - description: Field key inside the **data** json
     - label
       - type: String
       - default: use same than **id** 
       - description: Field label
     - format
       - type: String
       - default: string
       - description: boolean, integer, number, date, string
     - icon
       - type: String
       - default: ''
       - description: One of **vue-awesome** icons 
     - button
       - type: String
       - default: ''
       - description: One of **bootstrap3** buttons types, like success, danger, warning, ...
     - click
       - type: Function
       - default: none
       - description: button click method
     - static
       - type: Boolean
       - default: true
       - description: Field should be static or contain an input?
 - sort
   - type: Boolean
   - default: false
   - description: is sortable?
 - rows 
   - type: Number
   - default: 0
   - description: Rows per page, 0 means without pagination 
 - search 
   - type: Boolean
   - default: false
   - description: is search bar visible?
 - filter 
   - type: Boolean
   - default: false
   - description: is filter button visible?
 - group 
   - type: Boolean
   - default: false
   - description: is group button visible?
 - aggregate 
   - type: Boolean
   - default: false
   - description: is aggregations visible?
 - download 
   - type: Object
   - default: none
   - description: Download button info, if nothing passed no download button will be shown
   - props:
     - json
       - type: Boolean
       - default: false
       - description: false means type = **csv**, true means type = **json** 
     - ident
       - type: Number
       - default: 2
       - description: Identation for **json**
     - field
       - type: String
       - default: \t
       - description: Field separator on **csv**
     - line
       - type: String
       - default: \n
       - description: New line on **csv**
     - header
       - type: Boolean
       - default: true
       - description: Show header on **csv**
     - file
       - type: String
       - default: download
       - description: file name on download
 - methods 
   - type: Array
   - default: []
   - description: Array of user defined methods 
   - items (object):
     - button
       - type: String
       - default: ''
       - description:  One of **bootstrap3** buttons types, like success, danger, warning, ...
     - icon 
       - type: String
       - default: ''
       - description: **vue-awesome** icon
     - label 
       - type: String
       - default: ''
       - description: Button label
     - click
       - type: Function
       - default: none
       - description: on click function
 - icon 
   - type: String
   - default: ''
   - description: **vue-awesome** icon before table title
 - label
   - type: String
   - default: ''
   - description: table title 

## Contribute
We need help! Our goals are:
 - Separate classes and styles in order to add more css frameworks
 - Change props api in order to correctly support other css frameworks
 - Add more css frameworks like bootstrap4, bulma and foundation
 - Separate as plugin functions like sort, filter, group, etc
 - Add tests
 - More usage examples and better home page
 - Add support to most browsers
