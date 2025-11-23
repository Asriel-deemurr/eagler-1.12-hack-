function initAPI(version) {
  var ModAPI = {};
  ModAPI.events = {};
  ModAPI.events.types = ["event"];
  ModAPI.events.listeners = { "event": [] };
  ModAPI.globals = {};
  ModAPI.version = version;

  ModAPI.addEventListener = function AddEventListener(name, callback) {
    if (!callback) {
      throw new Error("Invalid callback!");
    }
    if (ModAPI.events.types.includes(name)) {
      if (!Array.isArray(ModAPI.events.listeners[name])) {
        ModAPI.events.listeners[name] = [];
      }
      ModAPI.events.listeners[name].push(callback);
      console.log("Added new event listener.");
    } else {
      throw new Error("This event does not exist!");
    }
  };

  ModAPI.removeEventListener = function removeEventListener(name, func, slow) {
    if (!func) {
      throw new Error("Invalid callback!");
    }
    if (!Array.isArray(ModAPI.events.listeners[name])) {
      ModAPI.events.listeners[name] = [];
    }
    var targetArr = ModAPI.events.listeners[name];
    if (!slow) {
      if (targetArr.indexOf(func) !== -1) {
        targetArr.splice(targetArr.indexOf(func), 1);
        console.log("Removed event listener.");
      }
    } else {
      var functionString = func.toString();
      targetArr.forEach((f, i) => {
        if (f.toString() === functionString) {
          targetArr.splice(i, 1);
          console.log("Removed event listener.");
        }
      });
    }
  };

  ModAPI.events.newEvent = function newEvent(name) {
    ModAPI.events.types.push(name);
  };

  ModAPI.events.callEvent = function callEvent(name, data) {
    if (
      !ModAPI.events.types.includes(name) ||
      !Array.isArray(ModAPI.events.listeners[name])
    ) {
      if (!Array.isArray(ModAPI.events.listeners[name])) {
        if (ModAPI.events.types.includes(name)) {
          ModAPI.events.listeners.event.forEach((func) => {
            func({ event: name, data: data });
          });
          return;
        }
        return;
      }
      console.error(
        "The ModAPI has been called with an invalid event name: " + name
      );
      console.error("Please report this bug to the repo.");
      return;
    }
    ModAPI.events.listeners[name].forEach((func) => {
      func(data);
    });
    ModAPI.events.listeners.event.forEach((func) => {
      func({ event: name, data: data });
    });

    ModAPI.globals._initUpdate();
  };

  ModAPI.updateComponent = function updateComponent(component) {
    if (
      typeof component !== "string" ||
      ModAPI[component] === null ||
      ModAPI[component] === undefined
    ) {
      return;
    }
    if (!ModAPI.globals || !ModAPI.globals.onGlobalsUpdate) {
      return;
    }
    if (!ModAPI.globals.toUpdate) {
      ModAPI.globals.toUpdate = [];
    }
    if (ModAPI.globals.toUpdate.indexOf(component) === -1) {
      ModAPI.globals.toUpdate.push(component);
    }
  };

  ModAPI.require = function require(component) {
    if (typeof component !== "string") {
      return;
    }
    if (!ModAPI.globals || !ModAPI.globals.onRequire) {
      return;
    }
    ModAPI.globals.onRequire(component);
  };

  ModAPI.globals._initUpdate = function _initUpdate() {
    if (!ModAPI.globals.toUpdate) {
      ModAPI.globals.toUpdate = [];
    }
    ModAPI.globals.toUpdate.forEach((id) => {
      ModAPI.globals.onGlobalsUpdate(id);
    });
    ModAPI.globals.toUpdate = [];
  };

  // ここまでが元からある ModAPI のコード



// --- ここからあなたのX-rayコード ---
/* Coalest xray mod */

/ (function () {
    var enabled = false
    ModAPI.addEventListener("key", function(ev){
        if(ev.key == 45){// the "x" key
          if(enabled){
                disable()
                enabled = false
          } else{
                update(); //Trigger the coal xray.
                enabled = true
          }
        }
    })
    var targets = ["diamond_block","diamond_ore","gold_block","gold_ore","iron_block","iron_ore","coal_block","coal_ore","emerald_ore","emerald_block","redstone_ore","redstone_block","lapis_ore","lapis_block","chest","furnace","lit_furnace","ender_chest"]; 
    var allblocks = Object.keys(ModAPI.blocks);
    function update() {
      ModAPI.displayToChat({msg: "xray Enabled!"})
      allblocks.forEach(block=>{
        if (targets.includes(block)) {
          ModAPI.blocks[block].forceRender = true;
          ModAPI.blocks[block].reload();
        } else if (ModAPI.blocks[block] && ("noRender" in ModAPI.blocks[block])) {
          ModAPI.blocks[block].noRender = true;
          ModAPI.blocks[block].reload();
        }
      });
      ModAPI.reloadchunks()
    }
    function disable(){
      ModAPI.displayToChat({msg: "xray Disabled!"})
      allblocks.forEach(block=>{
        if (ModAPI.blocks[block] && ("noRender" in ModAPI.blocks[block])) { 
          ModAPI.blocks[block].noRender = false;
          ModAPI.blocks[block].reload();
        }
      });
      ModAPI.reloadchunks()
    }
})();
// --- ここまでX-ray ---

  

  window.ModAPI = ModAPI;

}
