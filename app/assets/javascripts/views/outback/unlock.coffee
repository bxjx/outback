class UnlockView extends OutbackView
  constructor: ->
    super
    Users.bind 'outback:unlock:success', =>
      @announce('Unlocked')
      @redirectTo('home')
    Users.bind 'outback:unlock:failure', =>
      @announce('Unlock failed. Please try again.')
    @template = _.template('''
    <form action="#unlock" method="post">
      <p>Enter your Outback password:</p>
      <div data-role="fieldcontain">
        <label for="passphrase">Password</label>
        <input type="password" value="" name="passphrase" id="passphrase"/>
      </div>
      <div data-role="fieldcontain">
        <label for="timeout">Lock the screen if inactive for</label>
        <select data-theme="c" name="timeout" id="timeout">
          <option value="1">1 minute</option>
          <option value="5" selected="selected">5 minutes</option>
          <option value="15">15 minutes</option>
          <option value="30">30 minutes</option>
        </select>
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
    @el.find('h1').html('Unlock Outback')
    @el.find('.ui-content').html(@template())
    @reapplyStyles(@el)
    @delegateEvents()
    @reset()
  onSubmit: (e) ->
    e.preventDefault()
    e.stopPropagation()
    $.mobile.pageLoading()
    passphrase = @$('#passphrase').val()
    if not passphrase.match(/\D/)
      @announce('Password required')
    else
      Users.unlock(passphrase, $('#timeout').val())

  reset: ->
    @$('#passphrase').val('')

this.UnlockView = UnlockView
