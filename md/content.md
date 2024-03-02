# The Idea

This scaffold is going to be a template for all my educational web projects. I am trying to set default styles to all elements, using as least number of classes as possible. 

It's very opinionated, I am using my own font styles, colors and other design aspects. One of the main objectives is to achieve consistent look across all my educational porjects.

It looks super simple, because I want to focus on content and interactive snipets. It should handle all cases with common tags, have good support for markdown and unison snippets.

I am creating this scaffold because I also want to focus on the problem of reusability and create a clean HTML and CSS for that. If I did it right in some project, I would not feel much focus in the pursuit to finish the design sooner.

Below, I will just test all the content and interactive elements.

# Testing Standalone H1

# Testing H1 Followed by H2
## This is H2 after H1
### This is H3
#### This is H4

# H1 Followed by P

Some paragrath with text after H1

## H2 after P

Some paragrath after H2

### H3 after P

Some paragrath after H3

#### H4 after P

Some paragrath after H4

## Some Text With Links

This is some text with a <a href="https://guseyn.com">link</a>.

## Some DIV

<div>
	Well adjusted content here
</div>

## Some DIV with Text Above

Some text above

<div>
	Well adjusted content here
</div>


## Some DIV with Code

<div>
	<span>
		<img class="copy-icon" src="/image/copy.svg" onclick="copyText(this)">
	</span>
```js
const a = {}
const b = {}
```
</div>

## Some DIV with Math
    
<div>
	<span>
		<img class="copy-icon" src="/image/copy.svg" onclick="copyText(this)">
	</span>
```latex
\displaystyle{
	a = \sigma(\sum_{i=1}^{n}{x_i}{w_i} + b)
}
```
</div>


## Some DIV with Music

<div>
	<span>
		<img class="copy-icon" src="/image/copy.svg" onclick="copyText(this)">
	</span>
	<template is="unison-svg-midi" id="1">
		page line width is 268
		background color is white
		stretch units by 1.6 times
		page top padding is 7
		page bottom padding is 7
		measure ends with double bold barline
		treble clef
		a b c d e
	</template>
</div>

<div>
	<span>
		<img class="copy-icon" src="/image/copy.svg" onclick="copyText(this)">
	</span>
	<template is="unison-svg-midi" id="2">
		page line width is 268
		background color is white
		stretch units by 1.6 times
		page top padding is 7
		page bottom padding is 7
		measure ends with double bold barline
		treble clef
		g g g g g g
	</template>
</div>

## Some DIV with just SVG

<div>
	<span>
		<img class="copy-icon" src="/image/copy.svg" onclick="copyText(this)">
	</span>
	<template is="unison-svg" id="3">
		page line width is 268
		background color is white
		stretch units by 1.6 times
		page top padding is 7
		page bottom padding is 7
		measure ends with double bold barline
		treble clef
		g g g g g g
	</template>
</div>

## Some DIV with just MIDI

<div>
	<template is="unison-midi" id="4">
		page line width is 268
		background color is white
		stretch units by 1.6 times
		page top padding is 7
		page bottom padding is 7
		measure ends with double bold barline
		treble clef
		g g g g g g
	</template>
</div>

## Some DIV with just HTML Highlights

<div>
	<span>
		<img class="copy-icon" src="/image/copy.svg" onclick="copyText(this)">
	</span>
	<template is="unison-text-highlights" id="5">
		page line width is 268
		background color is white
		stretch units by 1.6 times
		page top padding is 7
		page bottom padding is 7
		measure ends with double bold barline
		treble clef
		g g g g g g
	</template>
</div>

## Some DIV with Unison Text Editor

<div>
	<span>
		<img alt="copy" class="copy-icon" src="/image/copy.svg" onclick="copyText(this)">
		<img alt="edit" class="edit-icon" src="/image/edit.svg" style="display: none" >
		<img alt="preview" class="render-icon" src="/image/render.svg">
	</span>
	<template is="unison-textarea-svg-midi" id="6">
		page line width is 268
		background color is white
		stretch units by 1.6 times
		page top padding is 7
		page bottom padding is 7
		measure ends with double bold barline
		treble clef
		g g g g g g
	</template>
</div>

## Some IMG

<img src="/image/portugal.png"/>

## Some Lists

Let's take a look at unordered list

- Point 1
	- Point 1,1
	- Point 1,2
	- Point 1,3
- Point 2
	- Point 2,1
	- Point 2,2
	- Point 2,3
- Point 3
	- Point 3,1
	- Point 3,2
	- Point 3,3
- Point 4
	- Point 4,1
	- Point 4,2
	- Point 4,3

Let's take a look at ordered list

1. Point 1
	1.1. Point 1,1
	1.2. Point 1,2
	1.3. Point 1,3
2. Point 2
	2.1. Point 2,1
	2.2. Point 2,2
	2.3. Point 2,3
3. Point 3
	3.1. Point 3,1
	3.2. Point 3,2
	3.3. Point 3,3
4. Point 4
	4.1. Point 4,1
	4.2. Point 4,2
	4.3. Point 4,3


## Inputs

<input type="text" placeholder="Your Name"></input>
<input type="password" placeholder="Your Password"></input>
<input type="email" placeholder="Your Email"></input>
<input type="number" placeholder="1"></input>
<input type="date" placeholder="1"></input>
<input type="time" placeholder="1"></input>
<input type="datetime-local" placeholder="1"></input>
<input type="url" placeholder="1"></input>
<input type="tel" placeholder="1"></input>

## Checkboxes

<div>
	<legend>Choose Your Options:</legend>
	<label>
		<input type="checkbox"/>
		Option 1
	</label>
	<label>
		<input type="checkbox"/>
		Option 2
	</label>
	<label>
		<input type="checkbox"/>
		Option 3
	</label>
	<label>
		<input type="checkbox"/>
		Option 4
	</label>
</div>

## Radiobuttons

<div>
	<legend>Choose Your Option:</legend>
	<label>
		<input type="radio" name="option"/>
		Option 1
	</label>
	<label>
		<input type="radio" name="option"/>
		Option 2
	</label>
	<label>
		<input type="radio" name="option"/>
		Option 3
	</label>
	<label>
		<input type="radio" name="option"/>
		Option 4
	</label>
</div>

## Buttons

<button>Button</button>
<button class="persist">Button</button>
<button class="delete">Button</button>
<button class="download">Button</button>

## Textarea

<textarea></textarea>


## Select

<div>
	<legend>Select you choice</legend>
	<select>
		<option>1</option>
		<option>2</option>
		<option>3</option>
		<option>4</option>
	</select>
</div>

## Tables

<table>
	<thead>
		<tr>
			<td>Name</td>
			<td>Age</td>
			<td>Height</td>
			<td>Weight</td>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td>John</td>
			<td>23</td>
			<td>175</td>
			<td>80</td>
		</tr>
		<tr>
			<td>Alice</td>
			<td>23</td>
			<td>175</td>
			<td>80</td>
		</tr>
		<tr>
			<td>JJ</td>
			<td>23</td>
			<td>175</td>
			<td>80</td>
		</tr>
	</tbody>
</table>
