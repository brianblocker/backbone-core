( function() {
	"use_strict";

	var App = { Collections : {}, Models : {}, Views : {}, Routers : {}, Mixins : {}, router : false, data : {}, view : false, __CONST__ : {} }

  App.__CONST__.CSS = {
    transition_end : 'webkitTransitionEnd.transition_end mozTransitionEnd.transition_end oTransitionEnd.transition_end msTransitionEnd.transition_end transitionend.transition_end'
  }

  Backbone.Model = Backbone.Model.extend( {
    children : null,
    initialize : function( options ) {
      this.beforeInitialize( options );
      
      if ( this.children ) {
        _.each( this.children, function( property, path ) {
          this._childBuilder( property, path, options );
        }, this )
      }

      this.afterInitialize( options );
    },
    validate : function( attributes ) {
      if ( this.validation_rules && attributes ) {
        var errors = new this.validationErrors()

        _.each( this.validation_rules, function( attribute_name, rule_function_name ) {
          if ( attributes[ attribute_name ] )
            errors.checkFor( this[ rule_function_name ]( attributes[ attribute_name ], attribute_name ) )
        }, this )

        if ( errors.exist() )
          return errors.report()
      }
    },
    beforeInitialize : function() {},
    afterInitialize : function() {},
    _childBuilder : function( property, path, options ) {
      var parts = path.replace( /\s/g, '' ).split( '.' )
      ,   child = App;

      _.each( parts, function( part ) {
        child = child[ part ];
      })

      if ( typeof options === 'undefined' || ! options[ property ] )
        this.set( property, new child )
      else
        this.set( property, new child( options[ property ] ) )
    }
  })

  Backbone.View = Backbone.View.extend( {
    defaults : {
      template : null,
      views : null
    },
    bindings : null,
    initialize : function( options ) {
      this.options = _.extend( {}, this.defaults, this.options, options )
      this._beforeInitialize( options );
      this.$el.data( 'view', this )
      this._setupBindings()
      this._afterInitialize( options );
    },
    render : function() {
      this._beforeRender();
      this.renderEl()
      this._afterRender();
      
      return this;
    },
    renderEl : function() {
      var that = this;

      dust.render( this.options.template, this.toJSON(), function( err, out ) {

        that.$el.html( out )
      })
    },
    renderViews : function() {
      _.each( this.options.views, this.renderView, this )
    },
    renderView : function( view, selector ) {
      var $target = this.$( selector )

      view.setElement( $target )
      view.render()

      // do we really need this?
      // this[ selector ] = view;
    },
    toJSON : function() {
      var data

      if ( this.model )
        data = this.model.toJSON()
      else if ( this.collection )
        data = this.collection.toJSON()
      else
        data = {}
      
      data.cid = this.cid;

      return data;
    },
    close : function() {
      this._beforeClose()
      this.remove();
      this._afterClose()
    },
    _setupBindings : function() {
      if ( this.bindings ) {
        _.each( this.bindings, function( fn, key ) {
          var data = this._parseBinding( key, fn )
        }, this )
      }
    },
    beforeRender : function() {},
    _beforeRender : function() {
      this.beforeRender();
    },
    afterRender : function() {},
    _afterRender : function() {
      if ( this.options.views ) 
        this.renderViews()

      this.afterRender();
    },
    beforeClose : function() {},
    _beforeClose : function() {
      if ( this.options.views ) {
        _.each( this.options.views, function( view ) {
          view.close();
        })
      }

      this.beforeClose()
    },
    beforeInitialize : function() {},
    _beforeInitialize : function( options ) {
      this.beforeInitialize( options );
    },
    afterInitialize : function() {},
    _afterInitialize : function( options ) {
      this._setupBindings()
      this.afterInitialize( options );
    },
    afterClose : function() {},
    _afterClose : function() {
      if ( this.options.views )
        this.options.views = this.defaults.views;

      this.afterClose();
    },
    _parseBinding : function( key, callback ) {
      key = key.replace( /\s*([,>:])\s*/g, '$1' )

      if ( typeof callback === 'string' && typeof this[ callback ] === 'function' )
        callback = this[ callback ]
      else if ( typeof callback !== 'function' )
        throw 'Invalid callback method: this.' + callback

      var matches = key.match( /(^.*)\s/i )
      ,   type = matches[ 1 ]
      ,   event_string = key.replace( matches[ 0 ], '' )
      ,   events = event_string.split( ',' )
      ,   types = type.split( '>' )
      ,   what = this[ types.splice( 0, 1 ) ]

      _.each( types, function( type ) {
        what = what.get( type )
      })

      /**
       *  DETACH at even first, just in case one was already there. Prevents "ghost events"
       **/
      _.each( events, function( ev ) {
        what.off( ev )
        what.on( ev, callback, this )
      }, this )
    }
  })

	return window.App = App;
})();