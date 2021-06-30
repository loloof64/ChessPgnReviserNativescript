<template>
  <FlexBoxLayout
    flexDirection="row"
    justifyContent="space-around"
    alignItems="center"
    :width="width"
    :height="height"
    backgroundColor="grey"
  >
    <SVGImage
    class="button"
      src="~/components/History/vectors/first.svg"
      :width="height"
      :height="height"
      @tap="gotoFirst"
    />

    <SVGImage
    class="button"
      src="~/components/History/vectors/previous.svg"
      :width="height"
      :height="height"
      @tap="gotoPrevious"
    />

    <SVGImage
    class="button"
      src="~/components/History/vectors/next.svg"
      :width="height"
      :height="height"
      @tap="gotoNext"
    />

    <SVGImage
    class="button"
      src="~/components/History/vectors/last.svg"
      :width="height"
      :height="height"
      @tap="gotoLast"
    />
  </FlexBoxLayout>
</template>

<script>
export default {
  props: {
    width: {
      type: Number,
      required: true,
    },
    height: {
      type: Number,
      required: true,
    },
  },
  setup(props, context) {
      function gotoFirst() {
          context.emit('gotoFirst');
      }

      function gotoPrevious() {
          context.emit('gotoPrevious');
      }

      function gotoNext() {
          context.emit('gotoNext');
      }

      function gotoLast() {
          context.emit('gotoLast');
      }

      return {
          gotoFirst, gotoPrevious, gotoNext, gotoLast
      }
  },
};
</script>

<style scoped>
.button {
    border: 3px solid black;
    background-color: #FFFFFF8A;
}
</style>