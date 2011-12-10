# Super class for outback views with various jquery mobile helpers
class OutbackView extends Backbone.View

  constructor: ->
    Users.bind 'outback:lock:success', =>
      @announce("Locking")
      @restart()
  
  logActivity: ->
    Users.logActivity()
 
  # the current page
  activePage: ->
    $("##{@page}")

  # Reapply the jquery mobile behaviours to the newly created page
  reapplyStyles: (el) ->
    el.find('ul[data-role]').listview()
    el.find('div[data-role="fieldcontain"]').fieldcontain()
    el.find('button[data-role="button"],a[data-role="button"]').button()
    el.find('input,textarea').textinput()
    el.find('div[data-role="collapsible"]').collapsible()
    el.find('select').selectmenu()
    el.page()

  # use jquery mobile's redirect
  redirectTo: (page) ->
    if page is 'home'
      $.mobile.changePage page, null, 'reverse'
    else
      $.mobile.changePage page

  # generic dialog
  announce: (message) ->
    $.mobile.pageLoading(true)
    # stole the ajax error from jquery mobile. hmm.. might replace with confirm
    $("<div class='ui-loader ui-overlay-shadow ui-body-e ui-corner-all'><h1>" + message + "</h1></div>")
      .css({ "display": "block", "opacity": 0.96, "top": $(window).scrollTop() + 100 })
      .appendTo( $.mobile.pageContainer )
      .delay( 800 )
      .fadeOut( 400, -> @remove )

  # convert date to iso format
  isoDate : (d) ->
    pad = (n)->
      if n < 10 then  "0" + n else  n
    "#{d.getUTCFullYear()}-#{pad(d.getUTCMonth()+1)}-#{pad(d.getUTCDate())}T#{pad(d.getUTCHours())}:#{pad(d.getUTCMinutes())}:#{pad(d.getUTCSeconds())}Z"

  # restart the application by reloading the page
  restart: ->
    # destroy all pages in the dom just in case they use back button
    $('.ui-page').remove()
    window.location = '/' 

this.OutbackView = OutbackView
