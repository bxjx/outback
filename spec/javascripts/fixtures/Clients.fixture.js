beforeEach(function() {
  this.fixtures = _.extend(this.fixtures || {}, {
  
    Clients: {
      
      valid: [
        {
          "id": 1,
          "first_name": 'Andrew',
          "last_name": 'Snow',
          "contacts": [
            {"id": 1, "created_at": new Date(), "notes": "Some notes made on contact"},
            {"id": 2, "created_at": new Date(), "notes": "Second contact"}
          ]
        },
        {
          "id": 2,
          "first_name": 'Rupert',
          "last_name": 'Taylor-Price',
          "epp": {
            signed_on: new Date(),
            interpreter: false,
            goal: 'some goal',
            work_experience_hours_required: true,
            work_experience_hours: 12
          }
        }
      ]
    }

  });
})
