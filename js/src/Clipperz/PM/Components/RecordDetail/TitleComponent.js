if (typeof(Clipperz) == 'undefined') { Clipperz = {}; }
if (typeof(Clipperz.PM) == 'undefined') { Clipperz.PM = {}; }
if (typeof(Clipperz.PM.Components) == 'undefined') { Clipperz.PM.Components = {}; }
if (typeof(Clipperz.PM.Components.RecordDetail) == 'undefined') { Clipperz.PM.Components.RecordDetail = {}; }

//#############################################################################

Clipperz.PM.Components.RecordDetail.TitleComponent = function(anElement, args) {
	args = args || {};

    Clipperz.PM.Components.RecordDetail.TitleComponent.superclass.constructor.call(this, anElement, args);

//	this._inputElement = null;

	this.mainComponent().addEditComponent(this);

	this.render();
	
	return this;
}

//=============================================================================

YAHOO.extendX(Clipperz.PM.Components.RecordDetail.TitleComponent, Clipperz.PM.Components.RecordDetail.AbstractComponent, {

	'toString': function() {
		return "Clipperz.PM.Components.RecordDetail.TitleComponent component";
	},

	//-------------------------------------------------------------------------

	'value': function() {
		return this.record().label();
	},

	'setValue': function(aValue) {
		this.record().setLabel(aValue);
	},
	
	//-------------------------------------------------------------------------
/*
	'inputElement': function() {
		return this._inputElement;
	},
	
	'setInputElement': function(aValue) {
		this._inputElement = aValue;
	},
*/
	//-------------------------------------------------------------------------

	'render': function() {
//		Clipperz.YUI.DomHelper.append(this.element().dom, {tag:'td', html:'&#160'});
//		Clipperz.YUI.DomHelper.append(this.element().dom, {tag:'td', colspan:"3", html:'&#160', children:[
//			{tag:'div', /*style:'border: 1px solid green;',*/ id:this.getId('title')}
//		]});
//		Clipperz.YUI.DomHelper.append(this.element().dom, {tag:'td', html:'&#160'});
//		
//		this.setInputElement(new Clipperz.PM.Components.TextFormField(this.getElement('title'), {editMode:this.editMode(), value:this.value()}));
		
		this.update();
	},

	//-------------------------------------------------------------------------
/*
	'update': function() {
		this.inputElement().update({value:this.value(), editMode:this.editMode()});
	},
*/	
	//-------------------------------------------------------------------------

	'updateViewMode': function() {
		this.element().update("");
		Clipperz.YUI.DomHelper.append(this.element().dom, {tag:'h2', html:this.value()});
	},

	//-------------------------------------------------------------------------
	
	'updateEditMode': function() {
//MochiKit.Logging.logDebug(">>> TitleComponent.updateEditMode");
//		this.getElement('title').update("");
//		Clipperz.YUI.DomHelper.append(this.getDom('title'), {tag:'div', id:this.getId('title_input')});
//		this.setInputElement(Clipperz.YUI.DomHelper.append(this.getDom('title_input'), {tag:'input', type:'text', value:this.value()}, true));
		
		this.element().update("");
		Clipperz.YUI.DomHelper.append(this.element().dom, {tag:'input', id:this.getId('titleField'), type:'text', value:"this.value()"});
		this.getElement('titleField').dom.value = this.value();
		
//MochiKit.Logging.logDebug("<<< TitleComponent.updateEditMode");
	},

	//-------------------------------------------------------------------------

	'synchronizeComponentValues': function() {
		var inputElement;
		
//MochiKit.Logging.logDebug(">>> TitleComponent.synchronizeComponentValues");
		inputElement = this.element().getChildrenByTagName('input')[0];
		
		if (inputElement != null) {
			this.setValue(inputElement.dom.value);
		}
//MochiKit.Logging.logDebug("<<< TitleComponent.synchronizeComponentValues");
	},
	
	//-------------------------------------------------------------------------
	__syntaxFix__: "syntax fix"
});

