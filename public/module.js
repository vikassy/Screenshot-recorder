// ----------------------------------------------- //
// Styling
var module_html = "<div id='sidebar'><a href='javascript:void(null);' ng-click='screenshot_mode($event);'>Screenshot</a>&nbsp;&nbsp<a href='javascript:void(null);' ng-click='send_automation()'>Save</a>&nbsp;&nbsp;<a href='javascript:void(null);' id='normal-mode'>Normal</a><hr /><div id='app-heading' style='color: white;text-align: center;'><b>Scenarios</b></div><hr /><div ng-repeat='step in steps' class='app-step' style='padding: 10px;'>{{step.text}}&nbsp;&nbsp;&nbsp;<a href='javascript:void(null);' id='remove-remove' ng-click=\"destroy($index);\">Remove</a><hr /></div></div><div>"
document.getElementsByTagName("html")[0].setAttribute("ng-app", "languageScreenshot");
document.getElementsByTagName("body")[0].setAttribute("ng-controller", "PageController");
document.getElementsByTagName("body")[0].setAttribute("bn-document-click", "handleClick( $event )");
$("body").prepend(module_html);
$("#sidebar").css("position", "absolute");
$("#sidebar").css("width", "250px");
$("#sidebar").css("height", window.height);
$("#sidebar").css("background-color", "grey");
$("#sidebar").css("z-index", "1000");
$("#sidebar").css("right", "0");
$("#sidebar").css("margin-top", "25px");

// ----------------------------------------------- //

$(window).click(function( event ){
    console.log(event);
});


var App = angular.module( "languageScreenshot", [] );


// -------------------------------------------------- //
// -------------------------------------------------- //


// Define our document-click directive. This will evaluate the
// given expression on the containing scope when the click
// event is triggered.
App.directive(
    "bnDocumentClick",
    function( $document, $parse ){

        // I connect the Angular context to the DOM events.
        var linkFunction = function( $scope, $element, $attributes ){

            // Get the expression we want to evaluate on the
            // scope when the document is clicked.
            var scopeExpression = $attributes.bnDocumentClick;

            // Compile the scope expression so that we can
            // explicitly invoke it with a map of local
            // variables. We need this to pass-through the
            // click event.
            //
            // NOTE: I ** think ** this is similar to
            // JavaScript's apply() method, except using a
            // set of named variables instead of an array.
            var invoker = $parse( scopeExpression );

            // Bind to the document click event.
            $document.click(
                function( event ){

                    // When the click event is fired, we need
                    // to invoke the AngularJS context again.
                    // As such, let's use the $apply() to make
                    // sure the $digest() method is called
                    // behind the scenes.
                    $scope.$apply(
                        function(){

                            // Invoke the handler on the scope,
                            // mapping the jQuery event to the
                            // $event object.
                            invoker(
                                $scope,
                                {
                                    $event: event
                                }
                            );

                        }
                    );
                    event.preventDefault();
                    event.stopImmediatePropagation();
                    return false;
                }
            );

            // TODO: Listen for "$destroy" event to remove
            // the event binding when the parent controller
            // is removed from the rendered document.

        };

        // Return the linking function.
        return( linkFunction );

    }
);


// -------------------------------------------------- //
// -------------------------------------------------- //


// I am the controller for the Body tag.
App.controller(
    "PageController",
    function( $scope, $http) {

        $scope.steps = [
          {text:'I go to Reference page', selected: true, element: null}];
        $scope.screenshot_mode = false;
        $scope.uniq_id = 1;

        $scope.handleClick = function( event ){
            e = event;
            var target = e.target || e.srcElement
            // text = target.textContent || text.innerText;
            // window["target"] = target;
            // console.log(target);
            if ($scope.screenshot_mode == true)
                return
            // console.log(fullPath(target));
            path = fullPath(target);
            // console.log(path.indexOf("#sidebar"));
            // console.log("PATH below!!");
            // console.log(path);
            if (path.indexOf("#sidebar") != -1)
                return
            if (path.indexOf("#normal-mode") != -1)
                return
            if (path.indexOf("#remove-remove") != -1)
                return
            // console.log(target.nodeName);
            // console.log(getXElementTreeXPath(target));
            // add_info("And I click on "+target)
            // console.log("dfisugfgjsy");
            id = $scope.steps.length
            $scope.steps.push({text: 'I click on '+target, selected: true, xpath: fullPath(target), action: "click", element: target.nodeName});
            event.preventDefault();
            event.stopImmediatePropagation();
            return false
        },

        $scope.screenshot_mode = function ($event) {
            // $event.stopImmediatePropagation();
            $event.stopPropagation();
            SetupDOMSelection();
            $scope.screenshot_mode = true;
        },

        $scope.normal_mode = function () {
            CleanupDOMSelection();
            $scope.screenshot_mode = false;
        },

        $scope.push_element = function (element, action) {
            path = fullPath(element);
            console.log("sdifugisdufgsdfo");
            console.log($scope.steps.length);
            $scope.steps.push({text: 'I '+action+' on '+element, selected: true, xpath: path, action: action, element: element.nodeName});
        },

        $scope.send_automation = function (){
            var title = prompt("Enter the Scenario name");
            var languages = prompt("Enter the languages, comma seperated");
            var hash = {steps: $scope.steps, title: title, languages: languages};
            $http.post('/done', hash);
        },

        $scope.destroy = function (id) {
            console.log(id);
            $scope.steps.splice(id, 1);
        }
    }
);

// -------------------------------------------------- //