beforeEach(function() {
  this.fixtures = _.extend(this.fixtures || {}, {
  
    Clients: {
      
      valid: [
        {
          "id": 1,
          "first_name": 'Andrew',
          "last_name": 'Snow'
        },
        {
          "id": 2,
          "first_name": 'Rupert',
          "last_name": 'Taylor-Price'
        }
      ]
    }

  });
})
