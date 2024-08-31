import React from 'react';

import styles from './SecSection.module.css';
import Double from '../HomeCategory/Double';
import { categories } from '../HomeCategory/data';

export default function SecSection() {
    return (
        <main className={styles.main}>
            <h1 className={styles.title}>Explore our diverse range of fashion categories</h1>
            <div className={styles.doubleContainer}>
                <Double
                    categories={[categories[0], categories[1]]}
                    reversed={false}
                />
            </div>
        </main>
    );
}