class SecureView extends OutbackView
  constructor: ->
    super
    Users.bind 'outback:unlock:success', =>
      @announce('Outback is now secure')
      @redirectTo('home')
    @template = _.template('''
    <form action="#secure" method="post">
      <p>Enter a passphrase to secure Outback. Do <strong>not</strong> use your Bridge or ESS password!</p>
      <div data-role="fieldcontain">
        <label for="passphrase">Password</label>
        <input type="password" value="" name="passphrase" id="passphrase"/>
      </div>
      <div data-role="fieldcontain">
        <label for="passphrase_confirmation">Confirm Password</label>
        <input type="password" value="" name="passphrase_confirmation" id="passphrase_confirmation"/>
      </div>
      <div class="ui-grid-a">
      <div class="ui-block-a">
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
    e.preventDefault()
    e.stopPropagation()
    $.mobile.pageLoading()
    passphrase = @$('#passphrase').val()
    if not passphrase.match(/\D/)
      @announce('Password required')
    else
      if passphrase is not @$('#passphrase_confirmation')
        @reset()
        @announce('Outback passwords do not match!')
      else
        @reset()
        Users.secure(passphrase)

  reset: ->
    @$('#passphrase').val('')
    @$('#passphrase_confirmation').val('')


this.SecureView = SecureView
