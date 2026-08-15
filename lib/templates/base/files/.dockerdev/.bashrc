# Bash внутри dev-контейнера (монтируется в /root/.bashrc).

export PATH="/app/bin:$PATH"
export HISTFILE="${HISTFILE:-/usr/local/hist/.bash_history}"
export HISTSIZE=10000
export HISTFILESIZE=20000
export HISTCONTROL=ignoreboth
shopt -s histappend
shopt -s checkwinsize

PS1='\[\e[1;36m\]docker\[\e[0m\]:\w\$ '

alias be='bundle exec'
alias r='bin/rails'
alias rc='bin/rails console'
alias rs='bin/rails server -b 0.0.0.0'
alias rspec='bundle exec rspec'
alias rubocop='bundle exec rubocop'
alias ll='ls -alh'
