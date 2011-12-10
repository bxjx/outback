class ResetView extends OutbackView
  constructor: ->
    super
    Users.bind 'outback:reset', =>
      @restart()
    @template = _.template('''
    <form action="#reset" method="post">
      <p>Delete any data stored on your device and reset Outback</p>
      <div class="ui-grid-a">
      <div class="ui-block-a">
        <a data-role="button" href="#" data-theme="c" data-rel="back">Cancel</a>
      </div>
      <div class="ui-block-b">
        <button data-theme="b" data-role="button" type="submit" name="submit" value="submit-value">Reset</button>
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
    @el.find('h1').html('Reset Outback')
    @el.find('.ui-content').html(@template())
    @reapplyStyles(@el)
    @delegateEvents()
  onSubmit: (e) ->
    e.preventDefault()
    e.stopPropagation()
    $.mobile.pageLoading()
    Users.erase()

this.ResetView = ResetView
