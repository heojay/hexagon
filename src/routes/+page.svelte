<script lang="ts">
    import {
        generateHexagonMap,
        checkNeighbors,
        checkSameLine,
        checkSum,
        sumsOfMap
    } from '$lib/game';
    import { onMount } from 'svelte';

    let map = [];
    let sums = {};
    let target;
    let message = '';
    let scores = 0;
    let isSolved = false;

    onMount(() => {
        map = generateHexagonMap();
        sums = sumsOfMap(map);
        const keys = Object.keys(sums);
        target = +keys[Math.floor(Math.random() * keys.length)];
    });

    $: points = [];
    let submittedPoints = new Set();

    function handleClick(i, j, k) {
        if (isSolved || points.length === 3) {
            return;
        }

        const index = points.findIndex((point) => point.i === i && point.j === j && point.k === k);
        if (index !== -1) {
            points.splice(index, 1);
        } else {
            points.push({ i, j, k });
        }
        if (points.length === 3) {
            if (alreadySubmitted(points)) {
                scores -= 1;
                message = 'You already submitted this combination';
            } else if (!checkNeighbors(points)) {
                scores -= 1;
                message = 'You can only select points that are neighbors';
            } else if (!checkSameLine(points)) {
                scores -= 1;
                message = 'You can only select points that are in the same line';
            } else if (!checkSum(map, points, target)) {
                scores -= 1;
                message = 'The sum of the selected points is not the target';
            } else {
                scores += 1;
                submittedPoints.add(normalizePoints(points));
                sums[target] = sums[target] - 1;
                if (sums[target] === 0) {
                    message = 'You solved all the combinations for this target';
                    isSolved = true;
                } else {
                    message = 'You got the points';
                }
            }
            // wait and reset the points

            if (!isSolved) {
                setTimeout(() => {
                    points = [];
                    message = '';
                }, 2000);
            }
        }
        points = [...points];
    }

    function handleKeydown(event, i, j, k) {
        if (event.key === 'Enter') {
            handleClick(i, j, k);
        }
    }

    function isInPoints(i, j, k, points) {
        return points.some((point) => point.i === i && point.j === j && point.k === k);
    }

    function normalizePoints(points) {
        const p0 = points[0].i + '-' + points[0].j + '-' + points[0].k;
        const p1 = points[1].i + '-' + points[1].j + '-' + points[1].k;
        const p2 = points[2].i + '-' + points[2].j + '-' + points[2].k;
        return [p0, p1, p2].sort().join(',');
    }

    function alreadySubmitted(points) {
        return submittedPoints.has(normalizePoints(points));
    }
</script>

<div class="title-container">
    <h1>Hexagon Grid</h1>
    <h2>Target: {target}</h2>
</div>
<div class="container">
    {#each map as x, i}
        <div class="line">
            {#each x as y, j}
                {#each y as z, k}
                    {#if z !== 0}
                        <div class="hexagon">
                            <div
                                role="button"
                                class="hexagon-inner"
                                tabindex="0"
                                on:click={() => handleClick(i, j, k)}
                                on:keydown={(event) => handleKeydown(event, i, j, k)}
                                class:hexagon-selected={isInPoints(i, j, k, points)}
                            >
                                {z}
                            </div>
                        </div>
                    {/if}
                {/each}
            {/each}
        </div>
    {/each}
</div>
<div class="status-container">
    <h2>Scores: {scores}</h2>
    <p>{message}</p>
</div>

<style>
    .title-container {
        text-align: center;
        margin-bottom: 10px;
    }

    h2 {
        margin-top: 10px;
    }

    .status-container {
        text-align: center;
        margin-top: 40px;
    }

    .container {
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .line {
        display: flex;
        margin-bottom: -19px;
    }

    .hexagon {
        width: 50px;
        height: 75px;
        background-color: black;
        position: relative;
        clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
    }

    .hexagon:before {
        content: '';
        width: 48px;
        height: 73px;
        background-color: white;
        display: block;
        position: absolute;
        top: 1px;
        left: 1px;
        clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
    }

    .hexagon-inner {
        position: absolute;
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .hexagon-selected {
        background-color: mediumpurple;
        color: white;
    }
</style>
