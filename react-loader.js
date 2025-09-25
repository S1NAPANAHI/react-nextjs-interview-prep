import FlashcardViewer from './components/FlashcardViewer.jsx';
import QuizViewer from './components/QuizViewer.jsx';

window.renderReactComponent = (componentName, containerId, props) => {
    const container = document.getElementById(containerId);
    if (!container) return;

    let component;
    if (componentName === 'FlashcardViewer') {
        component = FlashcardViewer;
    } else if (componentName === 'QuizViewer') {
        component = QuizViewer;
    } else {
        return;
    }

    const element = React.createElement(component, props);
    ReactDOM.render(element, container);
};