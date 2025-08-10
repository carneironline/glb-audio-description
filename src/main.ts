import { TextReader, type TextReaderOptions } from './glb-audio-description/SpeechSynthesisUtterance';
import { createIcons, icons } from 'lucide';

import './style.css';
import './glb-audio-description/glb-audio-description.css';

const config: TextReaderOptions = {
    pitch: 0.8,
    volume: 1,
};
const classMain = 'glb-audio-description';
const selectorMain = `.${classMain}`;
const classPlay = 'is-playing';
const classPause = 'is-paused';
const classStop = 'is-stopped';
const classNotPlayed = 'is-not-played';
const elements = document.querySelectorAll(selectorMain);
const containersToRead = ['.title', '.subtitle', '.content'];
const reader = new TextReader(config);

reader.init(() => {
    if (elements.length) {
        elements.forEach((element) => {
            element.classList.add(classNotPlayed);
            element.insertAdjacentHTML(
                'afterbegin',
                `
                <button class="glb-audio-description__button glb-audio-description__play">
                    <i class="glb-audio-description__play-icon" data-lucide="play"></i>
                    <i class="glb-audio-description__pause-icon" data-lucide="pause"></i>
                </button>
                <button class="glb-audio-description__button glb-audio-description__stop">
                    <i class="glb-audio-description__stop-icon" data-lucide="square"></i>
                </button>`
            );

            createIcons({ icons });

            element
                .querySelector('.glb-audio-description__play')
                ?.addEventListener('click', function (this: HTMLButtonElement) {
                    if (this.closest<HTMLElement>(selectorMain)?.classList.contains(classNotPlayed)) {
                        this.closest<HTMLElement>(selectorMain)?.classList.remove(
                            ...[classNotPlayed, classStop]
                        );
                        reader.readTextFromSelector(containersToRead);
                    }

                    if (this.closest<HTMLElement>(selectorMain)?.classList.contains(classPlay)) {
                        this.closest<HTMLElement>(selectorMain)?.classList.remove(classPlay);
                        this.closest<HTMLElement>(selectorMain)?.classList.add(classPause);
                        reader.pause();
                    } else {
                        this.closest<HTMLElement>(selectorMain)?.classList.remove(classPause);
                        this.closest<HTMLElement>(selectorMain)?.classList.add(classPlay);
                        reader.play('resume');
                    }
                });

            element
                .querySelector('.glb-audio-description__stop')
                ?.addEventListener('click', function (this: HTMLButtonElement) {
                    this.closest<HTMLElement>(selectorMain)?.classList.remove(classPlay);
                    this.closest<HTMLElement>(selectorMain)?.classList.add(classStop);
                    this.closest<HTMLElement>(selectorMain)?.classList.add(classNotPlayed);
                    reader.stop();
                });
        });
    }
});
