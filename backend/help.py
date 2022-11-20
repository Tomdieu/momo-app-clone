# an ordinary serializer
class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ('phone', 'company')


class UserSerializer(serializers.ModelSerializer):
    # nest the profile inside the user serializer
    profile = UserProfileSerializer()

    class Meta:
        model = UserModel
        fields = ('pk', 'username', 'email', 'first_name', 'last_name')
        read_only_fields = ('email', )

    def update(self, instance, validated_data):
        nested_serializer = self.fields['profile']
        nested_instance = instance.profile
        # note the data is `pop`ed
        nested_data = validated_data.pop('profile')
        nested_serializer.update(nested_instance, nested_data)
        # this will not throw an exception,
        # as `profile` is not part of `validated_data`
        return super(UserDetailsSerializer, self).update(instance, validated_data)