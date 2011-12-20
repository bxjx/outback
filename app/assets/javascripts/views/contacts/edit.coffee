class EditContact extends OutbackView
  constructor: (client, contactUid)->
    super
    @client = client
    @client.bind 'change', (changed_client) =>
      $.mobile.pageLoading(true)
      @announce('Contact deleted')
      @redirectToBack()
    @contactUid = contactUid
    @template = _.template('''
    <form action="#delete-contact" method="post">
      <p>Delete an unsynced contact</p>
      <div class="ui-grid-a">
      <div class="ui-block-a">
        <a data-role="button" href="#" data-theme="c" data-rel="back">Cancel</a>
      </div>
      <div class="ui-block-b">
        <button data-theme="b" data-role="button" type="submit" name="submit" value="submit-value">Delete</button>
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
    @el.find('h1').html('Delete Contact')
    @el.find('.ui-content').html(@template())
    @reapplyStyles(@el)
    @delegateEvents()
  onSubmit: (e) ->
    e.preventDefault()
    e.stopPropagation()
    $.mobile.pageLoading()
    @client.remove_contact(@contactUid)

this.EditContact = EditContact
