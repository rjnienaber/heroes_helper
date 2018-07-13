* other genetic algorithm libraries *
* https://github.com/methodswithclass/evolve
* https://github.com/sripberger/gene-lib
* https://github.com/jhaugh42/binary-breeder
* https://github.com/panchishin/geneticalgorithm
* https://github.com/muliyul/microverse
* https://github.com/fiberwire/enome
* https://github.com/mkmarek/forex.analytics
* https://github.com/methodswithclass/evolve

**Build**

    cd draft_picker && \
    git checkout master && \
    rm -rf /tmp/dist && \
    npm run build && \
    cp -R dist/ /tmp/dist/ && \
    cd .. && \
    git checkout gh-pages && \
    ls -1 | grep -vP 'collation|draft_picker' | xargs git rm && \
    cp /tmp/dist/* . && \
    ls -1 | grep -vP 'collation|draft_picker' | xargs git add

