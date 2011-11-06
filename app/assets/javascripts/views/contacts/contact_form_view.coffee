# Display a form to create or edit a contact and handle validation
class ContactFormView extends OutbackView
  constructor: (client) ->
    super
    @client = client
    @template = _.template('''
      <form action="#clients-<%=client.id%>" method="post">
        <div data-role="fieldcontain">
          <label for="notes">Notes</label><textarea name="notes" id="notes"></textarea>
        </div>
        <div class="ui-grid-a">
          <div class="ui-block-a"><a data-role="button" href="#" data-theme="c" data-rel="back">Cancel</a></div>
          <div class="ui-block-b"><button data-theme="b" data-role="button" type="submit" name="submit" value="submit-value">Save</button></div>
        </div>
      </form>
    ''')
    @render()
  events : {
    "submit form" : "onSubmit"
  }
  render: ->
    @el = @activePage()
    @el.find('h1').html('Contact Form')
    @el.find('.ui-content').html(@template({'client': @client}))
    @$("#notes").val('')
    @reapplyStyles(@el)
    @delegateEvents()
  onSubmit: (e) ->
    e.preventDefault()
    e.stopPropagation()
    $.mobile.pageLoading()
    callbacks = 
      success: (saved_contact, attrs) =>
        $('.ui-dialog').dialog('close')
      error: =>
        $('.ui-dialog').dialog('close')
        @announce(error)
    contacts = @client.get('contacts')
    contacts.unshift({'notes': @$('#notes').val(), 'created_at': new Date()})
    @client.save({'contacts': contacts}, callbacks)
    @client.change()

this.ContactFormView = ContactFormView
