
Entity = require("../lib/Entity.js").Entity;

describe('Entity setters and getters', function() {
  
  function MockEntity(props, prop_map) {
    var
      setters = {
        'A': function(value) {
          properties.A = +value; // cast to int
          
          // add a synthetic property
          properties.rounded_A = properties.A.toFixed(2);
          this.add_getter('rounded_A'); // this :(
        },
        'D': function(value) {
          properties.D = value+'ff';
        }
      },
      properties = { // name -> default
        'A': undefined, // prop map, setter
        'B': undefined, // undef default
        'C': 1, // default
        'D': undefined, // no prop map, setter
        'E': undefined, // no prop map, no setter
        'F': undefined // prop map, no setter
      },
      instance = Entity(properties, setters, props, prop_map);

    instance.prototype = MockEntity.prototype;
    return instance;
  }
  
  MockEntity.prototype = Entity.prototype;

  MockEntity.prototype.mock_prop_map = {
    'aaa': 'A',
    'bbb': 'B',
    'fff': 'F'
  }
  
  MockEntity.prototype.exterior_method = function() {
    this.set_D(this.get_A());
  }

  it('should assign properties correctly', function() {
    var
      props1 = {
        'aaa': '5',
        'D': '4',
        'E': 3,
        'fff': 12
      },
      me = MockEntity(props1, MockEntity.prototype.mock_prop_map);
            
    expect(me.get_A()).toEqual(5);
    expect(me.get_rounded_A()).toEqual('5.00');
    expect(typeof me.get_B()).toEqual('undefined');
    expect(me.get_C()).toEqual(1);
    expect(me.get_D()).toEqual('4ff');
    expect(me.get_E()).toEqual(3);
    expect(me.get_F()).toEqual(12);
    
    me.prototype.exterior_method.call(me);
    
    expect(me.get_D()).toEqual('5ff');
    
  });

});