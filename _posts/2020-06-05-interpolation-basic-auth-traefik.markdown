echo $(htpasswd -nb user password) | sed -e s/\\$/\\$\\$/g
