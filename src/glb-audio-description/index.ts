import { TextReader, type TextReaderOptions } from './SpeechSynthesisUtterance';
import { createIcons, icons } from 'lucide';
import './glb-audio-description.css';

export { TextReader };
export type { TextReaderOptions };

export interface InitOptions extends TextReaderOptions {
    selector?: string; // default .glb-audio-description
}

export function initAudioDescription(options: InitOptions = {}) {
    const { selector = '.glb-audio-description', ...readerOpts } = options;

    const reader = new TextReader(readerOpts);
    const classPlay = 'is-playing';
    const classPause = 'is-paused';
    const classStop = 'is-stopped';
    const classNotPlayed = 'is-not-played';

    function wire(element: HTMLElement) {
        const containersAttr = element.dataset.containerstoread;
        if (!containersAttr) return;
        let containers: string[] = [];
        try {
            containers = JSON.parse(containersAttr);
        } catch {
            return;
        }

        if (!element.querySelector('.glb-audio-description__play')) {
            element.classList.add(classNotPlayed);
            element.insertAdjacentHTML(
                'afterbegin',
                `
                <button class="glb-audio-description__button glb-audio-description__play">
                    <i class="glb-audio-description__play-icon" data-lucide="play"></i>
                    <i class="glb-audio-description__pause-icon" data-lucide="square"></i>
                </button>`
            );
            createIcons({ icons });
        }

        element
            .querySelector('.glb-audio-description__play')
            ?.addEventListener('click', function (this: HTMLButtonElement) {
                if (element.classList.contains(classNotPlayed)) {
                    element.classList.remove(classNotPlayed, classStop);
                    reader.readTextFromSelector(containers);
                }

                if (element.classList.contains(classPlay)) {
                    element.classList.remove(classPlay);
                    element.classList.add(classStop, classNotPlayed);
                    reader.stop();
                } else {
                    element.classList.remove(classPause);
                    element.classList.add(classPlay);
                    reader.play();
                }
            });
    }

    reader.init(() => {
        document.querySelectorAll(selector).forEach((el) => wire(el as HTMLElement));
    });

    return { reader };
}
