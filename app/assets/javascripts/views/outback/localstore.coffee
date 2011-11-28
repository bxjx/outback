class LocalStoreView extends OutbackView
  constructor: ->
    super
    @template = _.template('''
    <form action="#passphrase" method="post">
      <p>Enter a passphrase to secure Outback. Do <strong>not</strong> use your Bridge or ESS password!</p>
      <div data-role="fieldcontain">
        <label for="pin">Password</label>
        <input type="password" value="" name="pin" id="pin"/>
      </div>
      <div data-role="fieldcontain">
        <label for="pin_confirmation">Confirm Password</label>
        <input type="password" value="" name="pin_confirmation" id="pin_confirmation"/>
      </div>
      <div class="ui-grid-a">
      <div class="ui-block-a">
        <a data-role="button" href="#" data-theme="c" data-rel="back">Cancel</a>
      </div>
      <div class="ui-block-b">
        <button data-theme="b" data-role="button" type="submit" name="submit" value="submit-value">Submit</button>
      </div>
      </div>
    </form>
    ''')
    @render()
  events : {
    "submit form" : "onSubmit"
  }
  render: ->
    @el = @activePage()
    @el.find('h1').html('Outback Passphrase')
    @el.find('.ui-content').html(@template())
    @reapplyStyles(@el)
    @delegateEvents()
  onSubmit: (e) ->
    $.mobile.pageLoading()
    #Users.create_with_pin(
    #  @$("input[name='password']").val()
    #)
    e.preventDefault()
    e.stopPropagation()

this.LocalStoreView = LocalStoreView
